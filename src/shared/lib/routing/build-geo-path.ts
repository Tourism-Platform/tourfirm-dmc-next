export function buildCountryPath(countrySlug: string): string {
	return `/${countrySlug}`;
}

export function buildRegionPath(
	countrySlug: string,
	regionSlug: string
): string {
	return `/${countrySlug}/${regionSlug}`;
}

export function buildCityPath(
	countrySlug: string,
	regionSlug: string,
	citySlug: string
): string {
	return `/${countrySlug}/${regionSlug}/${citySlug}`;
}

export function buildAttractionPath(
	countrySlug: string,
	regionSlug: string,
	citySlug: string,
	attractionSlug: string
): string {
	return `/${countrySlug}/${regionSlug}/${citySlug}/${attractionSlug}`;
}

export function buildGeoPath(segments: readonly string[]): string {
	if (segments.length === 0) {
		return "/";
	}

	return `/${segments.join("/")}`;
}
