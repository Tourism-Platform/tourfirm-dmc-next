import { buildExperienceMetaModel } from "./experience-meta.model";
import { buildPaginationModel } from "./pagination.model";
import { buildThemeFilterBarModel } from "./theme-filter-bar.model";
import type {
	TSystemWidgetEntry,
	TWidgetModel,
	TWidgetModelBuildInput
} from "./widget-model.types";

export const SYSTEM_WIDGET_REGISTRY: Record<string, TSystemWidgetEntry> = {
	pagination: {
		key: "pagination",
		buildModel: buildPaginationModel("blog")
	},
	experienceMeta: {
		key: "experienceMeta",
		buildModel: buildExperienceMetaModel
	},
	discoveryFilterBar: {
		key: "discoveryFilterBar",
		buildModel: buildThemeFilterBarModel
	}
};

export function getSystemWidget(key: string): TSystemWidgetEntry | undefined {
	return SYSTEM_WIDGET_REGISTRY[key];
}

export function resolveWidgetModel(
	key: string,
	input: TWidgetModelBuildInput,
	routeKey?: string
): TWidgetModel | null {
	const entry = getSystemWidget(key);

	if (!entry) {
		return null;
	}

	if (key === "pagination" && routeKey) {
		return buildPaginationModel(routeKey)(input);
	}

	return entry.buildModel(input);
}
