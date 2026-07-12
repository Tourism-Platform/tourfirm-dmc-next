import type { TBreadcrumbConfig } from "../build-breadcrumbs";

export type TRouteRuntimeEntry = {
	routeKey: string;
	data: {
		collection?: string;
		hubGlobal?: string;
		enrichment: "hub" | "detail" | "both" | "none";
		adapterKey?: string;
	};
	presentation: {
		breadcrumbs: TBreadcrumbConfig;
		paginationNamespace?: string;
		metadataSource: "entity" | "hub" | "entity-only";
	};
	layout: {
		widgets?: { hub?: string[]; detail?: string[] };
		widgetPlacement?: "beforeCms" | "afterCms";
	};
};
