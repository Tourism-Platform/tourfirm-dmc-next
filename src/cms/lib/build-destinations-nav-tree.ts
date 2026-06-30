import { buildNavigationGeoPath } from "@/shared/lib/routing/build-navigation-geo-path";
import type {
	TDestinationsNavCountry,
	TDestinationsNavNode,
	TDestinationsNavRegion,
	TDestinationsNavTree
} from "@/shared/types/destinations-nav.types";

import type { Badge, City, Country, Region } from "@/payload-types";

const FEATURED_BADGE_SLUGS = new Set(["FEATURED", "TOP_PICK"]);

type TNavSortable = {
	navOrder?: number | null;
	title: string;
};

type TJoinDoc<T> = number | T;

function getEntityId(
	value: TJoinDoc<{ id: number }> | null | undefined
): number | null {
	if (value == null) {
		return null;
	}

	return typeof value === "number" ? value : value.id;
}

function isFeatured(badges: (number | Badge)[] | null | undefined): boolean {
	if (!badges?.length) {
		return false;
	}

	return badges.some((badge) => {
		if (typeof badge === "number") {
			return false;
		}

		return FEATURED_BADGE_SLUGS.has(badge.slug);
	});
}

function compareNavItems(a: TNavSortable, b: TNavSortable): number {
	const orderA = a.navOrder ?? 0;
	const orderB = b.navOrder ?? 0;

	if (orderA !== orderB) {
		return orderA - orderB;
	}

	return a.title.localeCompare(b.title);
}

function toNavNode(
	doc: {
		id: number;
		slug: string;
		title: string;
		navOrder?: number | null;
		badges?: (number | Badge)[] | null;
	},
	rootSlug: string,
	geoSegments: string[]
): TDestinationsNavNode {
	return {
		id: String(doc.id),
		slug: doc.slug,
		title: doc.title,
		href: buildNavigationGeoPath(rootSlug, geoSegments),
		featured: isFeatured(doc.badges)
	};
}

export function buildDestinationsNavTree(
	rootSlug: string,
	countries: Country[],
	regions: Region[],
	cities: City[]
): TDestinationsNavTree {
	const regionsByCountry = new Map<number, Region[]>();
	const citiesByRegion = new Map<number, City[]>();

	for (const region of regions) {
		const countryId = getEntityId(region.country);

		if (countryId == null) {
			continue;
		}

		const bucket = regionsByCountry.get(countryId) ?? [];
		bucket.push(region);
		regionsByCountry.set(countryId, bucket);
	}

	for (const city of cities) {
		const regionId = getEntityId(city.region);

		if (regionId == null) {
			continue;
		}

		const bucket = citiesByRegion.get(regionId) ?? [];
		bucket.push(city);
		citiesByRegion.set(regionId, bucket);
	}

	const sortedCountries = [...countries].sort(compareNavItems);

	const treeCountries: TDestinationsNavCountry[] = sortedCountries.map(
		(country) => {
			const countryRegions = [
				...(regionsByCountry.get(country.id) ?? [])
			].sort(compareNavItems);

			const treeRegions: TDestinationsNavRegion[] = countryRegions.map(
				(region) => {
					const regionCities = [
						...(citiesByRegion.get(region.id) ?? [])
					].sort(compareNavItems);

					return {
						...toNavNode(region, rootSlug, [
							country.slug,
							region.slug
						]),
						cities: regionCities.map((city) =>
							toNavNode(city, rootSlug, [
								country.slug,
								region.slug,
								city.slug
							])
						)
					};
				}
			);

			return {
				...toNavNode(country, rootSlug, [country.slug]),
				regions: treeRegions
			};
		}
	);

	return {
		rootHref: buildNavigationGeoPath(rootSlug, []),
		countries: treeCountries
	};
}
