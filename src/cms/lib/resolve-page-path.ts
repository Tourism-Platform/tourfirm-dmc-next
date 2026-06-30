import {
	buildPagePath,
	buildSegmentPagePath
} from "@/shared/lib/routing/build-cms-path";

import type { Page, Segment } from "@/payload-types";

function getSegmentFromPage(page: Page): Segment | null {
	const segment = page.segment;

	if (!segment || typeof segment === "number") {
		return null;
	}

	return segment;
}

export function resolvePagePath(page: Page): string {
	const segment = getSegmentFromPage(page);

	if (segment?.slug) {
		return buildSegmentPagePath(segment.slug, page.slug);
	}

	return buildPagePath(page.slug);
}
