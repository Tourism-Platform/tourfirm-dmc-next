export function buildPagePath(pageSlug: string): string {
	return `/${pageSlug}`;
}

export function buildSegmentPagePath(
	segmentSlug: string,
	pageSlug: string
): string {
	return `/${segmentSlug}/${pageSlug}`;
}

/** @deprecated Use buildPagePath */
export function buildCmsPath(slug: string): string {
	return buildPagePath(slug);
}
