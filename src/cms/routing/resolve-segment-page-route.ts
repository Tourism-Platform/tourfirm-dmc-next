import { findPageBySegmentAndSlug } from "../api/find-page-by-segment-and-slug";
import { findSegmentBySlug } from "../api/find-segment-by-slug";

import type { Page, Segment } from "@/payload-types";

export type TSegmentPageRoute = {
	kind: "segment-page";
	document: Page;
	segment: Segment;
};

export async function resolveSegmentPageRoute(
	locale: string,
	segmentSlug: string,
	pageSlug: string
): Promise<TSegmentPageRoute | null> {
	const segment = await findSegmentBySlug(locale, segmentSlug);

	if (!segment) {
		return null;
	}

	const page = await findPageBySegmentAndSlug(locale, segment.id, pageSlug);

	if (!page) {
		return null;
	}

	return {
		kind: "segment-page",
		document: page,
		segment
	};
}
