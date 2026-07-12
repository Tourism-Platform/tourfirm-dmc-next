import type { TAppRoute } from "./app-route.types";
import type { TEntityLoadResult, TRouteData } from "./types/route-data.types";
import { resolveWidgetModel } from "./widgets/system-widget.registry";
import type { TWidgetModel } from "./widgets/widget-model.types";

export function buildWidgetModels(
	route: TAppRoute,
	data: TRouteData,
	entityResult: TEntityLoadResult
): TWidgetModel[] {
	const layout = data.runtime.layout;
	const widgetKeys =
		route.source === "collection" && route.kind === "hub"
			? (layout.widgets?.hub ?? [])
			: route.source === "collection" && route.kind === "detail"
				? (layout.widgets?.detail ?? [])
				: route.source === "cms" && route.kind === "page"
					? (layout.widgets?.detail ?? [])
					: [];

	const input = { data, entityResult };
	const models: TWidgetModel[] = [];

	for (const key of widgetKeys) {
		const model = resolveWidgetModel(key, input, route.routeKey);

		if (model) {
			models.push(model);
		}
	}

	return models;
}
