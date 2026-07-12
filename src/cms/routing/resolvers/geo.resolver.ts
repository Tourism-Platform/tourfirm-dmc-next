import type { TAppRoute } from "../app-route.types";
import type { TEntityLoadResult } from "../types/route-data.types";

export async function geoResolver(
	route: TAppRoute,
	_locale: string
): Promise<TEntityLoadResult> {
	if (route.source !== "geo") {
		throw new Error("Invalid geo route");
	}

	const doc = route.document as unknown as Record<string, unknown>;

	return {
		entity: {
			id: (doc.id as number | string) ?? "",
			slug: String(doc.slug ?? ""),
			title: String(doc.title ?? ""),
			entityType: "geo"
		},
		blocks: Array.isArray(route.document.blocks)
			? route.document.blocks
			: [],
		seo: (route.document.seo ?? {}) as TEntityLoadResult["seo"],
		rawDocument: route.document
	};
}
