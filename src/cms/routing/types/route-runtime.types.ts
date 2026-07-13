import type { TDiscoveryPaginationKey } from "@/shared/ui-content";

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
		paginationKey?: TDiscoveryPaginationKey;
		metadataSource: "entity" | "hub" | "entity-only";
	};
	layout: {
		widgets?: { hub?: string[]; detail?: string[] };
		widgetPlacement?: "beforeCms" | "afterCms";
	};
};
