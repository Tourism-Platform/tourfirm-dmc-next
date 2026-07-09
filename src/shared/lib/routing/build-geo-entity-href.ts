import { buildNavigationGeoPath } from "./build-navigation-geo-path";
import type { Attraction, City, Country, Region } from "@/payload-types";

function getSlug(entity: { slug?: string | null } | number | null | undefined) {
	if (!entity || typeof entity === "number") {
		return undefined;
	}

	return entity.slug ?? undefined;
}

export function buildCountryHref(
	navigationRootSlug: string,
	country: Country | number | null | undefined
): string {
	if (!country || typeof country === "number") {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	const slug = getSlug(country);

	if (!slug) {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	return buildNavigationGeoPath(navigationRootSlug, [slug]);
}

export function buildCityHref(
	navigationRootSlug: string,
	city: City | number | null | undefined
): string {
	if (!city || typeof city === "number") {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	const country =
		typeof city.country === "object" && city.country !== null
			? city.country
			: null;
	const region =
		typeof city.region === "object" && city.region !== null
			? city.region
			: null;
	const citySlug = getSlug(city);
	const countrySlug = country ? getSlug(country) : undefined;
	const regionSlug = region ? getSlug(region) : undefined;

	if (!countrySlug || !regionSlug || !citySlug) {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	return buildNavigationGeoPath(navigationRootSlug, [
		countrySlug,
		regionSlug,
		citySlug
	]);
}

export function buildAttractionHref(
	navigationRootSlug: string,
	attraction: Attraction | number | null | undefined
): string {
	if (!attraction || typeof attraction === "number") {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	const country =
		typeof attraction.country === "object" && attraction.country !== null
			? attraction.country
			: null;
	const region =
		typeof attraction.region === "object" && attraction.region !== null
			? attraction.region
			: null;
	const city =
		typeof attraction.city === "object" && attraction.city !== null
			? attraction.city
			: null;
	const attractionSlug = getSlug(attraction);
	const countrySlug = country ? getSlug(country) : undefined;
	const regionSlug = region ? getSlug(region) : undefined;
	const citySlug = city ? getSlug(city) : undefined;

	if (!countrySlug || !regionSlug || !citySlug || !attractionSlug) {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	return buildNavigationGeoPath(navigationRootSlug, [
		countrySlug,
		regionSlug,
		citySlug,
		attractionSlug
	]);
}

export function buildRegionHref(
	navigationRootSlug: string,
	region: Region | number | null | undefined
): string {
	if (!region || typeof region === "number") {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	const country =
		typeof region.country === "object" && region.country !== null
			? region.country
			: null;
	const regionSlug = getSlug(region);
	const countrySlug = country ? getSlug(country) : undefined;

	if (!countrySlug || !regionSlug) {
		return buildNavigationGeoPath(navigationRootSlug, []);
	}

	return buildNavigationGeoPath(navigationRootSlug, [
		countrySlug,
		regionSlug
	]);
}
