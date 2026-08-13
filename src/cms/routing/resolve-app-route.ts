/**
 * Route strategy: registry-driven discovery routes + CMS destination + geo hierarchy.
 */
import {
	isBlockedGeoEntitySlug,
	isStaticAppRouteSegment,
	isSystemReservedSegment
} from "@/shared/config/routes";
import { buildNavigationGeoPath } from "@/shared/lib/routing/build-navigation-geo-path";

import { getDestination } from "../api/get-destination";
import { getDestinationSlug } from "../api/get-destination-slug";

import type { TAppRoute } from "./app-route.types";
import { matchRegistryRoute } from "./collection-route.registry";
import type { TGeoRoute } from "./geo-route.types";
import { type TCmsRoute, resolveCmsRoute } from "./resolve-cms-route";
import { MAX_GEO_SEGMENTS, resolveGeoRoute } from "./resolve-geo-route";
import { resolveSegmentPageRoute } from "./resolve-segment-page-route";
import { hasHubGlobal } from "./route-runtime.registry";

export type { TAppRoute } from "./app-route.types";

/** Max URL segments including navigation root slug. */
export const MAX_APP_ROUTE_SEGMENTS = MAX_GEO_SEGMENTS + 1;

/** Same default used by `/destinations/...` speculative geo. */
const SPECULATIVE_DESTINATIONS_ROOT = "destinations";

function isStaticReserved(segments: readonly string[]): boolean {
	const first = segments[0];

	if (!first) {
		return false;
	}

	return isStaticAppRouteSegment(first) || isSystemReservedSegment(first);
}

function toRegistryAppRoute(
	matched: NonNullable<ReturnType<typeof matchRegistryRoute>>
): TAppRoute {
	if (matched.kind === "hub") {
		return {
			routeKey: matched.routeKey,
			target: matched.target,
			source: "collection",
			kind: "hub"
		};
	}

	if (matched.kind === "page") {
		return {
			routeKey: matched.routeKey,
			target: matched.target,
			source: "cms",
			kind: "page",
			slug: matched.slug,
			document: {} as never
		};
	}

	return {
		routeKey: matched.routeKey,
		target: matched.target,
		source: "collection",
		kind: "detail",
		slug: matched.slug
	};
}

function augmentLegacyCmsRoute(
	cmsRoute: TCmsRoute,
	routeKey: string
): TAppRoute {
	if (cmsRoute.kind === "destination") {
		return {
			routeKey,
			target: { type: "destination" },
			source: "cms",
			kind: "destination",
			document: cmsRoute.document
		};
	}

	if (cmsRoute.kind === "segment-page") {
		return {
			routeKey,
			target: { type: "page", segment: cmsRoute.segment.slug ?? "" },
			source: "cms",
			kind: "segment-page",
			document: cmsRoute.document,
			segment: cmsRoute.segment
		};
	}

	return {
		routeKey,
		target: { type: "page", segment: "root" },
		source: "cms",
		kind: "page",
		document: cmsRoute.document,
		slug: cmsRoute.document.slug ?? ""
	};
}

function augmentGeoRoute(geoRoute: TGeoRoute): TAppRoute {
	return {
		routeKey: `geo:${geoRoute.kind}:${geoRoute.document.slug}`,
		target: { type: "geo" },
		source: "geo",
		...geoRoute
	};
}

const resolveAppRouteInflight = new Map<string, Promise<TAppRoute | null>>();

export async function resolveAppRoute(
	locale: string,
	segments: readonly string[]
): Promise<TAppRoute | null> {
	const key = `${locale}:${segments.join("/")}`;
	const existing = resolveAppRouteInflight.get(key);

	if (existing) {
		return existing;
	}

	const pending = resolveAppRouteInner(locale, segments).finally(() => {
		resolveAppRouteInflight.delete(key);
	});

	resolveAppRouteInflight.set(key, pending);
	return pending;
}

async function resolveAppRouteInner(
	locale: string,
	segments: readonly string[]
): Promise<TAppRoute | null> {
	if (segments.length === 0 || segments.length > MAX_APP_ROUTE_SEGMENTS) {
		return null;
	}

	if (isStaticReserved(segments)) {
		return null;
	}

	const registryMatch = matchRegistryRoute(segments, hasHubGlobal);

	if (registryMatch) {
		return toRegistryAppRoute(registryMatch);
	}

	const destinationNavPromise = getDestinationSlug(locale);
	const destGeoSegments =
		segments.length >= 2 && segments[0] === SPECULATIVE_DESTINATIONS_ROOT
			? segments.slice(1)
			: null;
	const destGeoPromise =
		destGeoSegments && destGeoSegments.length <= MAX_GEO_SEGMENTS
			? resolveGeoRoute(
					locale,
					destGeoSegments,
					SPECULATIVE_DESTINATIONS_ROOT
				)
			: null;

	const firstSegment = segments[0];
	const shouldSpeculateShortCountry =
		segments.length === 1 &&
		firstSegment != null &&
		firstSegment !== SPECULATIVE_DESTINATIONS_ROOT &&
		!isBlockedGeoEntitySlug(firstSegment);
	const shortCountryGeoPromise = shouldSpeculateShortCountry
		? resolveGeoRoute(locale, segments, SPECULATIVE_DESTINATIONS_ROOT)
		: null;

	const destinationNav = await destinationNavPromise;
	const navigationRootSlug = destinationNav?.slug;

	if (navigationRootSlug && segments[0] === navigationRootSlug) {
		if (segments.length === 1) {
			const destination = await getDestination(locale);
			if (!destination) {
				return null;
			}
			return {
				routeKey: "destination",
				target: { type: "destination" },
				source: "cms",
				kind: "destination",
				document: destination
			};
		}

		const geoSegments = segments.slice(1);
		if (geoSegments.length > MAX_GEO_SEGMENTS) {
			return null;
		}

		const geoRoute = destGeoPromise
			? await destGeoPromise
			: await resolveGeoRoute(locale, geoSegments, navigationRootSlug);

		if (geoRoute) {
			return augmentGeoRoute(geoRoute);
		}

		return null;
	}

	if (segments.length === 2) {
		const segmentPageRoute = await resolveSegmentPageRoute(
			locale,
			segments[0]!,
			segments[1]!
		);

		if (segmentPageRoute) {
			return augmentLegacyCmsRoute(
				segmentPageRoute,
				`segment:${segments[0]}/${segments[1]}`
			);
		}

		return null;
	}

	if (segments.length === 1) {
		const cmsRoute = await resolveCmsRoute(locale, segments[0]!);

		if (cmsRoute) {
			return augmentLegacyCmsRoute(cmsRoute, `cms:${segments[0]}`);
		}

		if (navigationRootSlug && shortCountryGeoPromise) {
			const geoRoute = await shortCountryGeoPromise;
			if (geoRoute) {
				if (navigationRootSlug !== SPECULATIVE_DESTINATIONS_ROOT) {
					return augmentGeoRoute({
						...geoRoute,
						path: buildNavigationGeoPath(
							navigationRootSlug,
							segments
						)
					});
				}
				return augmentGeoRoute(geoRoute);
			}
		}
	}

	return null;
}
