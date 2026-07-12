import type { TRouteData } from "../types/route-data.types";
import type { TEntityLoadResult } from "../types/route-data.types";

export type TWidgetModel =
	| { key: "pagination"; props: Record<string, unknown> }
	| { key: "routeTimeline"; props: { items: unknown[] } }
	| { key: "experienceMeta"; props: Record<string, unknown> }
	| { key: "discoveryFilterBar"; props: { filters: unknown[] } };

export type TWidgetModelBuildInput = {
	data: TRouteData;
	entityResult: TEntityLoadResult;
};

export type TWidgetModelBuilder = (
	input: TWidgetModelBuildInput
) => TWidgetModel | null;

export type TSystemWidgetEntry = {
	key: string;
	buildModel: TWidgetModelBuilder;
};
