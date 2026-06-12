"use client";

import { useSyncExternalStore } from "react";

import type { TRouteMapStop } from "../model/types/route-map.types";

import { RouteMap } from "./route-map";

const emptySubscribe = () => () => {};

type TRouteMapViewProps = {
	stops: TRouteMapStop[];
};

export function RouteMapView({ stops }: TRouteMapViewProps) {
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);

	return (
		<div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl border">
			{mounted ? (
				<RouteMap stops={stops} />
			) : (
				<div
					className="bg-muted h-full w-full animate-pulse"
					aria-hidden
				/>
			)}
		</div>
	);
}
