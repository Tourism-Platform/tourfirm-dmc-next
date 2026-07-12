import type { TAppRoute } from "./app-route.types";
import type { TRouteData } from "./types/route-data.types";
import type { TResolveBlockDataContext } from "@/cms/lib/resolve-block-data.types";

export function shouldEnrichBlocks(
	route: TAppRoute,
	enrichment: TRouteData["runtime"]["data"]["enrichment"]
): boolean {
	if (enrichment === "none") {
		return false;
	}

	if (route.source === "collection" && route.kind === "hub") {
		return enrichment === "hub" || enrichment === "both";
	}

	if (route.source === "collection" && route.kind === "detail") {
		return enrichment === "detail" || enrichment === "both";
	}

	return false;
}

export function buildEnrichmentInput(
	data: TRouteData,
	rawDocument: unknown
): Pick<
	TResolveBlockDataContext,
	"document" | "locale" | "navigation" | "collections" | "query"
> {
	const collection = data.runtime.data.collection;
	const collections: Record<string, unknown[]> = {};

	if (collection && data.list?.docs) {
		collections[collection] = data.list.docs;
	}

	if (data.dependencies.similarExperiences) {
		collections.similarExperiences = data.dependencies.similarExperiences;
	}

	if (data.dependencies.themeRoutes) {
		collections.routes = data.dependencies.themeRoutes;
	}

	if (data.dependencies.themeExperiences) {
		collections.experiences = data.dependencies.themeExperiences;
	}

	return {
		document: (rawDocument ?? {}) as Record<string, unknown>,
		locale: data.locale,
		navigation: data.navigation,
		collections,
		query: data.pagination
			? { page: String(data.pagination.page) }
			: undefined
	};
}
