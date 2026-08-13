import { isBlockedGeoEntitySlug } from "@/shared/config";
import { buildNavigationGeoPath } from "@/shared/lib/routing/build-navigation-geo-path";

import {
	findAttractionBySlug,
	findCityBySlug,
	findCityRefBySlug,
	findCountryBySlug,
	findCountryRefBySlug,
	findRegionBySlug,
	findRegionRefBySlug
} from "../api";
import { relationId } from "../api/relation-id";

import type { TGeoRoute, TGeoSegment } from "./geo-route.types";

export const MAX_GEO_SEGMENTS = 4;

const GEO_ENTITY_TYPES = ["country", "region", "city", "attraction"] as const;

function buildGeoSegments(slugs: readonly string[]): readonly TGeoSegment[] {
	return slugs.map((slug, index) => ({
		slug,
		type: GEO_ENTITY_TYPES[index]!
	}));
}

export async function resolveGeoRoute(
	locale: string,
	segments: readonly string[],
	navigationRootSlug: string
): Promise<TGeoRoute | null> {
	if (segments.length === 0 || segments.length > MAX_GEO_SEGMENTS) {
		return null;
	}

	const [countrySlug, regionSlug, citySlug, attractionSlug] = segments;

	if (!countrySlug || isBlockedGeoEntitySlug(countrySlug)) {
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
			segments: buildGeoSegments(segments)
		};
	}

	if (!regionSlug) {
		return null;
	}

	// Leaf select omits parent FKs (depth 1 would populate full parents).
	// Parallel depth-0 regionRef supplies country id for hierarchy check.
	if (segments.length === 2) {
		const [country, region, regionRef] = await Promise.all([
			findCountryRefBySlug(locale, countrySlug),
			findRegionBySlug(locale, regionSlug),
			findRegionRefBySlug(locale, regionSlug)
		]);

		if (!country || !region || !regionRef) {
			return null;
		}

		if (relationId(regionRef.country) !== country.id) {
			return null;
		}

		return {
			kind: "region",
			document: region,
			country,
			path: buildPath(segments),
			segments: buildGeoSegments(segments)
		};
	}

	if (!citySlug) {
		return null;
	}

	if (segments.length === 3) {
		const [country, region, city, cityRef] = await Promise.all([
			findCountryRefBySlug(locale, countrySlug),
			findRegionRefBySlug(locale, regionSlug),
			findCityBySlug(locale, citySlug),
			findCityRefBySlug(locale, citySlug)
		]);

		if (!country || !region || !city || !cityRef) {
			return null;
		}

		if (
			relationId(region.country) !== country.id ||
			relationId(cityRef.country) !== country.id ||
			relationId(cityRef.region) !== region.id
		) {
			return null;
		}

		return {
			kind: "city",
			document: city,
			country,
			region,
			path: buildPath(segments),
			segments: buildGeoSegments(segments)
		};
	}

	if (!attractionSlug) {
		return null;
	}

	const [country, region, city] = await Promise.all([
		findCountryRefBySlug(locale, countrySlug),
		findRegionRefBySlug(locale, regionSlug),
		findCityRefBySlug(locale, citySlug)
	]);

	if (!country || !region || !city) {
		return null;
	}

	if (
		relationId(region.country) !== country.id ||
		relationId(city.country) !== country.id ||
		relationId(city.region) !== region.id
	) {
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
		segments: buildGeoSegments(segments)
	};
}
