import {
	buildPagePath,
	resolveSegmentPagePublicPath
} from "@/shared/lib/routing/build-cms-path";

import type { TCmsRoute } from "./resolve-cms-route";

export function getCmsRoutePath(
	route: TCmsRoute,
	fallbackSegment?: string
): string {
	if (route.kind === "segment-page") {
		return resolveSegmentPagePublicPath(
			route.segment.slug,
			route.document.slug,
			route.document.pathGroup
		);
	}

	if (route.kind === "destination") {
		return buildPagePath(route.document.slug ?? fallbackSegment ?? "");
	}

	return buildPagePath(route.document.slug ?? "");
}
