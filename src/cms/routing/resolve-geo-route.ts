import { isReservedPathSegment } from "@/shared/config";
import { buildNavigationGeoPath } from "@/shared/lib/routing/build-navigation-geo-path";

import {
	findAttractionBySlug,
	findCityBySlug,
	findCountryBySlug,
	findRegionBySlug
} from "../api";

import type { TGeoRoute } from "./geo-route.types";

export const MAX_GEO_SEGMENTS = 4;

export async function resolveGeoRoute(
	locale: string,
	segments: readonly string[],
	navigationRootSlug: string
): Promise<TGeoRoute | null> {
	if (segments.length === 0 || segments.length > MAX_GEO_SEGMENTS) {
		return null;
	}

	const [countrySlug, regionSlug, citySlug, attractionSlug] = segments;

	if (!countrySlug || isReservedPathSegment(countrySlug)) {
		return null;
	}

	const buildPath = (geoSegments: readonly string[]) =>
		buildNavigationGeoPath(navigationRootSlug, geoSegments);

	if (segments.length === 1) {
		const country = await findCountryBySlug(locale, countrySlug);

		if (!country) {
			return null;
		}

		return {
			kind: "country",
			document: country,
			path: buildPath(segments),
			segments: [countrySlug]
		};
	}

	if (!regionSlug) {
		return null;
	}

	const country = await findCountryBySlug(locale, countrySlug);

	if (!country) {
		return null;
	}

	const region = await findRegionBySlug(locale, country.id, regionSlug);

	if (!region) {
		return null;
	}

	if (segments.length === 2) {
		return {
			kind: "region",
			document: region,
			country,
			path: buildPath(segments),
			segments: [countrySlug, regionSlug]
		};
	}

	if (!citySlug) {
		return null;
	}

	const city = await findCityBySlug(locale, country.id, region.id, citySlug);

	if (!city) {
		return null;
	}

	if (segments.length === 3) {
		return {
			kind: "city",
			document: city,
			country,
			region,
			path: buildPath(segments),
			segments: [countrySlug, regionSlug, citySlug]
		};
	}

	if (!attractionSlug) {
		return null;
	}

	const attraction = await findAttractionBySlug(
		locale,
		city.id,
		attractionSlug
	);

	if (!attraction) {
		return null;
	}

	return {
		kind: "attraction",
		document: attraction,
		country,
		region,
		city,
		path: buildPath(segments),
		segments: [countrySlug, regionSlug, citySlug, attractionSlug]
	};
}
