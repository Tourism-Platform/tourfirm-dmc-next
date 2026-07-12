import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { TBlockRenderProps } from "@/shared/ui/blocks";

import type { TAppRoute } from "../app-route.types";
import type { TWidgetModel } from "../widgets/widget-model.types";

import type { TRouteData } from "./route-data.types";
import type { TRouteRuntimeEntry } from "./route-runtime.types";

export type TRenderContext = {
	route: TAppRoute;
	locale: string;
	runtime: TRouteRuntimeEntry;
	data: TRouteData;
	breadcrumbs: { label: string; href: string }[];
	metadata: { seo: TRouteData["seo"]; path: string };
	sections: TBlockRenderProps[];
	widgetModels: TWidgetModel[];
	enrichment: boolean;
};

export type TRenderedWidgets = {
	beforeCms: ReactNode[];
	afterCms: ReactNode[];
};

export type TRenderCmsRouteResult = {
	metadata: Metadata;
	content: ReactNode;
};
