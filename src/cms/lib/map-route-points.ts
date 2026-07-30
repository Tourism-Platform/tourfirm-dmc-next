import type { TRouteMapStop } from "@/shared/ui/route-map";

import type { MapPoint } from "@/payload-types";

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
