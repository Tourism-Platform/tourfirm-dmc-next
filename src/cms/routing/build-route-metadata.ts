import type { TAppRoute } from "./app-route.types";
import { buildCmsRoutePath } from "./build-cms-route-path";
import type { TRouteData } from "./types/route-data.types";
import type { TRouteRuntimeEntry } from "./types/route-runtime.types";

export function buildRouteMetadataInput(
	route: TAppRoute,
	runtime: TRouteRuntimeEntry,
	data: TRouteData
): { seo: TRouteData["seo"]; path: string } {
	const { metadataSource } = runtime.presentation;

	let seo = data.seo;
	let path = buildCmsRoutePath(route.routeKey);

	if (metadataSource === "hub" && data.hub) {
		seo = data.seo;
		path = buildCmsRoutePath(route.routeKey);
	}

	if (metadataSource === "entity-only" || metadataSource === "entity") {
		if (route.source === "collection" && route.kind === "detail") {
			path = buildCmsRoutePath(route.routeKey, { slug: route.slug });
		}

		if (route.source === "cms" && route.kind === "page") {
			path = buildCmsRoutePath(route.routeKey, { slug: route.slug });
		}
	}

	if (route.source === "geo") {
		path = route.path;
	}

	return { seo, path };
}
