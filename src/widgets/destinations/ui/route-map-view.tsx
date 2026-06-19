"use client";

import dynamic from "next/dynamic";

import type { TRouteMapStop } from "../model/types/route-map.types";

const RouteMap = dynamic(
	() => import("./route-map").then((mod) => mod.RouteMap),
	{
		ssr: false,
		loading: () => (
			<div className="bg-muted h-full w-full animate-pulse" aria-hidden />
		)
	}
);

type TRouteMapViewProps = {
	stops: TRouteMapStop[];
};

export function RouteMapView({ stops }: TRouteMapViewProps) {
	return (
		<div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl border">
			<RouteMap stops={stops} />
		</div>
	);
}
