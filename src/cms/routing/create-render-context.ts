import type { TAppRoute } from "./app-route.types";
import { shouldEnrichBlocks } from "./build-enrichment-input";
import { buildEnrichmentInput } from "./build-enrichment-input";
import { buildRouteBreadcrumbs } from "./build-route-breadcrumbs";
import { buildRouteMetadataInput } from "./build-route-metadata";
import type { TRenderContext } from "./types/render-context.types";
import type { TEntityLoadResult, TRouteData } from "./types/route-data.types";
import type { TWidgetModel } from "./widgets/widget-model.types";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export function createRenderContext(args: {
	route: TAppRoute;
	data: TRouteData;
	entityResult: TEntityLoadResult;
	widgetModels: TWidgetModel[];
}): TRenderContext {
	const { route, data, entityResult, widgetModels } = args;
	const enrichment = shouldEnrichBlocks(route, data.runtime.data.enrichment);

	const blocks = enrichment
		? resolveBlockData(
				data.blocks,
				buildEnrichmentInput(data, entityResult.rawDocument)
			)
		: data.blocks;

	return {
		route,
		locale: data.locale,
		runtime: data.runtime,
		data,
		breadcrumbs: buildRouteBreadcrumbs(route, data.runtime, data),
		metadata: buildRouteMetadataInput(route, data.runtime, data),
		sections: mapCmsBlocks(blocks),
		widgetModels,
		enrichment
	};
}
