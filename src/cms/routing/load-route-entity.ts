import type { TAppRoute } from "./app-route.types";
import { resolveEntityByTarget } from "./entity-resolver.registry";
import type { TEntityLoadResult } from "./types/route-data.types";

export async function loadRouteEntity(
	route: TAppRoute,
	locale: string
): Promise<TEntityLoadResult> {
	if (route.source === "collection") {
		return resolveEntityByTarget(route, locale);
	}

	if (route.source === "cms" && route.kind === "page") {
		return resolveEntityByTarget(route, locale);
	}

	if (route.source === "cms" && route.kind === "destination") {
		return resolveEntityByTarget(route, locale);
	}

	if (route.source === "geo") {
		return resolveEntityByTarget(route, locale);
	}

	if (route.source === "cms" && route.kind === "segment-page") {
		const doc = route.document as unknown as Record<string, unknown>;

		return {
			entity: {
				id: (doc.id as number | string) ?? "",
				slug: String(doc.slug ?? ""),
				title: String(doc.title ?? ""),
				entityType: "page"
			},
			blocks: Array.isArray(route.document.blocks)
				? route.document.blocks
				: [],
			seo: (route.document.seo ?? {}) as TEntityLoadResult["seo"],
			rawDocument: route.document
		};
	}

	throw new Error("Unsupported route for entity loading");
}
