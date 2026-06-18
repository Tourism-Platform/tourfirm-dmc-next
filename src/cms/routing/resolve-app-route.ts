/**
 * Route strategy: CMS destination global (navigation root) + geo hierarchy.
 *
 * URL: /{locale}/{destinationPageSlug}/[{country}/{region}/{city}/{attraction}]
 * destinationPageSlug comes from CMS global `destination.slug` — never hardcoded.
 */
import { getDestination } from "../api/get-destination";

import type { TGeoRoute } from "./geo-route.types";
import { type TCmsRoute, resolveCmsRoute } from "./resolve-cms-route";
import { MAX_GEO_SEGMENTS, resolveGeoRoute } from "./resolve-geo-route";

export type TAppRoute =
	| ({ source: "geo" } & TGeoRoute)
	| ({ source: "cms" } & TCmsRoute);

/** Max URL segments including navigation root slug. */
export const MAX_APP_ROUTE_SEGMENTS = MAX_GEO_SEGMENTS + 1;

export async function resolveAppRoute(
	locale: string,
	segments: readonly string[]
): Promise<TAppRoute | null> {
	if (segments.length === 0 || segments.length > MAX_APP_ROUTE_SEGMENTS) {
		return null;
	}

	const destination = await getDestination(locale);
	const navigationRootSlug = destination?.slug;

	if (navigationRootSlug && segments[0] === navigationRootSlug) {
		if (segments.length === 1) {
			return {
				source: "cms",
				kind: "destination",
				document: destination
			};
		}

		const geoSegments = segments.slice(1);

		if (geoSegments.length > MAX_GEO_SEGMENTS) {
			return null;
		}

		const geoRoute = await resolveGeoRoute(
			locale,
			geoSegments,
			navigationRootSlug
		);

		if (geoRoute) {
			return { source: "geo", ...geoRoute };
		}

		return null;
	}

	if (segments.length === 1) {
		const cmsRoute = await resolveCmsRoute(locale, segments[0]!);

		if (cmsRoute) {
			return { source: "cms", ...cmsRoute };
		}
	}

	return null;
}
