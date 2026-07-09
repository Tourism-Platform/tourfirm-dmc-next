import type { TRouteMapStop } from "@/shared/ui/route-map";

import type { MapPoint } from "@/payload-types";

const MAP_POINT_TYPE_LABELS: Record<string, string> = {
	CITY: "City",
	ATTRACTION: "Attraction",
	OVERNIGHT: "Overnight",
	BORDER: "Border",
	AIRPORT: "Airport",
	WAYPOINT: "Waypoint"
};

export type TRouteTimelineItem = {
	id: string;
	order: number;
	type: string;
	typeLabel: string;
	title: string;
	subtitle?: string;
};

function resolveMapPointTitle(point: MapPoint): string {
	if (point.title) {
		return point.title;
	}

	if (point.attraction && typeof point.attraction === "object") {
		return point.attraction.title ?? "";
	}

	if (point.city && typeof point.city === "object") {
		return point.city.title ?? "";
	}

	return "";
}

function resolveMapPointSubtitle(point: MapPoint): string | undefined {
	if (point.city && typeof point.city === "object" && point.title) {
		return point.city.title ?? undefined;
	}

	return undefined;
}

export function mapRoutePointsToStops(
	mapPoints: MapPoint[] | null | undefined
): TRouteMapStop[] {
	if (!mapPoints?.length) {
		return [];
	}

	return [...mapPoints]
		.sort((a, b) => a.order - b.order)
		.map((point) => ({
			id: String(point.id),
			lat: point.latitude,
			lng: point.longitude,
			name: resolveMapPointTitle(point)
		}));
}

export function mapRoutePointsToTimeline(
	mapPoints: MapPoint[] | null | undefined
): TRouteTimelineItem[] {
	if (!mapPoints?.length) {
		return [];
	}

	return [...mapPoints]
		.sort((a, b) => a.order - b.order)
		.map((point) => ({
			id: String(point.id),
			order: point.order,
			type: point.type,
			typeLabel: MAP_POINT_TYPE_LABELS[point.type] ?? point.type,
			title: resolveMapPointTitle(point),
			subtitle: resolveMapPointSubtitle(point)
		}));
}

export function resolveRouteMapCenter(
	mapPoints: MapPoint[] | null | undefined
): [number, number] {
	if (!mapPoints?.length) {
		return [41.2, 68.5];
	}

	const sorted = [...mapPoints].sort((a, b) => a.order - b.order);
	const first = sorted[0]!;

	return [first.latitude, first.longitude];
}
