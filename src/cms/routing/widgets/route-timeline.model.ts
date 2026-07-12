import type { TWidgetModelBuilder } from "./widget-model.types";
import { extractMapPoints } from "@/cms/lib/map-discovery-cards";
import {
	type TRouteTimelineItem,
	mapRoutePointsToTimeline
} from "@/cms/lib/map-route-points";
import type { Route } from "@/payload-types";

export const buildRouteTimelineModel: TWidgetModelBuilder = ({
	entityResult
}) => {
	const route = entityResult.rawDocument as Route | null;

	if (!route) {
		return null;
	}

	const items = mapRoutePointsToTimeline(extractMapPoints(route));

	if (!items.length) {
		return null;
	}

	return {
		key: "routeTimeline",
		props: { items: items as TRouteTimelineItem[] }
	};
};
