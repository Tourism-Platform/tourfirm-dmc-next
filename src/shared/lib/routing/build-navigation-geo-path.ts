export function buildNavigationGeoPath(
	navigationRootSlug: string,
	geoSegments: readonly string[]
): string {
	if (!navigationRootSlug) {
		throw new Error("navigationRootSlug is required");
	}

	if (geoSegments.length === 0) {
		return `/${navigationRootSlug}`;
	}

	return `/${[navigationRootSlug, ...geoSegments].join("/")}`;
}
