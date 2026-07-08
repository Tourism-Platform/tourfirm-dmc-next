export function buildPagePath(pageSlug: string): string {
	return `/${pageSlug}`;
}

export function buildSegmentPagePath(
	segmentSlug: string,
	pageSlug: string
): string {
	return `/${segmentSlug}/${pageSlug}`;
}

export function buildGroupedSegmentPagePath(
	segmentSlug: string,
	pathGroup: string,
	pageSlug: string
): string {
	return `/${segmentSlug}/${pathGroup}/${pageSlug}`;
}

export function resolveSegmentPagePublicPath(
	segmentSlug: string,
	pageSlug: string,
	pathGroup?: string | null
): string {
	if (pathGroup) {
		return buildGroupedSegmentPagePath(segmentSlug, pathGroup, pageSlug);
	}

	return buildSegmentPagePath(segmentSlug, pageSlug);
}

/** @deprecated Use buildPagePath */
export function buildCmsPath(slug: string): string {
	return buildPagePath(slug);
}
