import type { TRouteRuntimeEntry } from "./types/route-runtime.types";

export const ROUTE_RUNTIME_REGISTRY: readonly TRouteRuntimeEntry[] = [
	{
		routeKey: "blog",
		data: {
			collection: "blog",
			hubGlobal: "blog-hub",
			enrichment: "both",
			adapterKey: "standard"
		},
		presentation: {
			breadcrumbs: {
				hub: [{ label: "Blog", routeKey: "blog" }],
				detail: { includeEntityTitle: true }
			},
			paginationKey: "blog",
			metadataSource: "hub"
		},
		layout: {
			widgets: { hub: ["pagination"] },
			widgetPlacement: "afterCms"
		}
	},
	{
		routeKey: "routes",
		data: {
			collection: "routes",
			hubGlobal: "routes-hub",
			enrichment: "both",
			adapterKey: "routes"
		},
		presentation: {
			breadcrumbs: {
				hub: [{ label: "Routes", routeKey: "routes" }],
				detail: { includeEntityTitle: true }
			},
			paginationKey: "routes",
			metadataSource: "hub"
		},
		layout: {
			widgets: { hub: ["pagination"] },
			widgetPlacement: "afterCms"
		}
	},
	{
		routeKey: "experiences",
		data: {
			collection: "experiences",
			hubGlobal: "experiences-hub",
			enrichment: "both",
			adapterKey: "experiences"
		},
		presentation: {
			breadcrumbs: {
				hub: [{ label: "Experiences", routeKey: "experiences" }],
				detail: { includeEntityTitle: true }
			},
			paginationKey: "experiences",
			metadataSource: "hub"
		},
		layout: {
			widgets: { hub: ["pagination"], detail: ["experienceMeta"] },
			widgetPlacement: "afterCms"
		}
	},
	{
		routeKey: "themes",
		data: {
			collection: "themes",
			enrichment: "detail",
			adapterKey: "themes"
		},
		presentation: {
			breadcrumbs: {
				detail: { includeEntityTitle: true }
			},
			metadataSource: "entity-only"
		},
		layout: {
			widgets: { detail: ["discoveryFilterBar"] },
			widgetPlacement: "beforeCms"
		}
	},
	{
		routeKey: "company-news",
		data: {
			collection: "news",
			hubGlobal: "news-hub",
			enrichment: "both",
			adapterKey: "news"
		},
		presentation: {
			breadcrumbs: {
				hub: [
					{ label: "Company", href: "/company/about" },
					{ label: "News", routeKey: "company-news" }
				],
				detail: { includeEntityTitle: true }
			},
			paginationKey: "news",
			metadataSource: "hub"
		},
		layout: {
			widgets: { hub: ["pagination"] },
			widgetPlacement: "afterCms"
		}
	},
	{
		routeKey: "company-trade-fairs",
		data: {
			collection: "trade-fairs",
			hubGlobal: "trade-fairs-hub",
			enrichment: "both",
			adapterKey: "standard"
		},
		presentation: {
			breadcrumbs: {
				hub: [
					{ label: "Company", href: "/company/about" },
					{ label: "Trade fairs", routeKey: "company-trade-fairs" }
				],
				detail: { includeEntityTitle: true }
			},
			paginationKey: "tradeFairs",
			metadataSource: "hub"
		},
		layout: {
			widgets: { hub: ["pagination"] },
			widgetPlacement: "afterCms"
		}
	},
	{
		routeKey: "team",
		data: {
			enrichment: "none"
		},
		presentation: {
			breadcrumbs: {
				detail: { includeEntityTitle: true }
			},
			metadataSource: "entity-only"
		},
		layout: {}
	}
] as const;

const RUNTIME_BY_KEY = new Map(
	ROUTE_RUNTIME_REGISTRY.map((entry) => [entry.routeKey, entry])
);

export function getRouteRuntime(
	routeKey: string
): TRouteRuntimeEntry | undefined {
	return RUNTIME_BY_KEY.get(routeKey);
}

export function hasHubGlobal(routeKey: string): boolean {
	return Boolean(getRouteRuntime(routeKey)?.data.hubGlobal);
}
