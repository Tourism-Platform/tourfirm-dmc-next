import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";

import type { TAppRoute } from "./app-route.types";
import { buildCmsRoutePath } from "./build-cms-route-path";
import type { TRouteData } from "./types/route-data.types";
import type { TRouteRuntimeEntry } from "./types/route-runtime.types";

export function buildRouteBreadcrumbs(
	route: TAppRoute,
	runtime: TRouteRuntimeEntry,
	data: TRouteData
): { label: string; href: string }[] {
	const config = runtime.presentation.breadcrumbs;
	const items: { label: string; href: string }[] = [];

	if (config.hub) {
		for (const item of config.hub) {
			items.push({
				label: item.label,
				href:
					item.href ??
					buildCmsRoutePath(item.routeKey ?? route.routeKey)
			});
		}
	}

	const entityTitle = data.entity?.title;
	const entitySlug = data.entity?.slug;

	if (
		entityTitle &&
		entitySlug &&
		config.detail?.includeEntityTitle !== false &&
		((route.source === "collection" && route.kind === "detail") ||
			(route.source === "cms" && route.kind === "page"))
	) {
		items.push({
			label: entityTitle,
			href: buildCmsRoutePath(route.routeKey, { slug: entitySlug })
		});
	}

	return buildDiscoveryBreadcrumbs(items);
}
