import type { TAppRoute } from "../app-route.types";
import type { TEntityLoadResult } from "../types/route-data.types";
import type { TRouteTarget } from "../types/route-target.types";

import { findPageBySegmentGroupAndSlug } from "@/cms/api/find-page-by-segment-group-and-slug";
import { findSegmentBySlug } from "@/cms/api/find-segment-by-slug";

function toEntity(doc: Record<string, unknown>): TEntityLoadResult["entity"] {
	return {
		id: (doc.id as number | string) ?? "",
		slug: String(doc.slug ?? ""),
		title: String(doc.title ?? ""),
		entityType: "page"
	};
}

export async function pageResolver(
	route: TAppRoute,
	locale: string
): Promise<TEntityLoadResult> {
	const target = route.target as Extract<TRouteTarget, { type: "page" }>;

	if (
		target.type !== "page" ||
		route.source !== "cms" ||
		route.kind !== "page"
	) {
		throw new Error("Invalid page route");
	}

	const segment = await findSegmentBySlug(locale, target.segment);

	if (!segment || typeof segment.id !== "number") {
		throw new Error(`Segment not found: ${target.segment}`);
	}

	const page = await findPageBySegmentGroupAndSlug(
		locale,
		segment.id,
		target.pathGroup ?? "",
		route.slug
	);

	if (!page) {
		throw new Error(`Page not found: ${route.slug}`);
	}

	const doc = page as unknown as Record<string, unknown>;

	return {
		entity: toEntity(doc),
		blocks: Array.isArray(page.blocks) ? page.blocks : [],
		seo: (page.seo ?? {}) as TEntityLoadResult["seo"],
		rawDocument: page
	};
}
