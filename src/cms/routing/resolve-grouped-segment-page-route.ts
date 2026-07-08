import { isPagePathGroup } from "@/shared/config/routes/page-path-groups";

import { findPageBySegmentGroupAndSlug } from "../api/find-page-by-segment-group-and-slug";
import { findSegmentBySlug } from "../api/find-segment-by-slug";

import type { TSegmentPageRoute } from "./resolve-segment-page-route";

export async function resolveGroupedSegmentPageRoute(
	locale: string,
	segmentSlug: string,
	pathGroup: string,
	pageSlug: string
): Promise<TSegmentPageRoute | null> {
	if (!isPagePathGroup(pathGroup)) {
		return null;
	}

	const segment = await findSegmentBySlug(locale, segmentSlug);

	if (!segment) {
		return null;
	}

	const page = await findPageBySegmentGroupAndSlug(
		locale,
		segment.id,
		pathGroup,
		pageSlug
	);

	if (!page) {
		return null;
	}

	return {
		kind: "segment-page",
		document: page,
		segment
	};
}
