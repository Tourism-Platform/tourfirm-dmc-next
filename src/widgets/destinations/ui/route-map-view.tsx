"use client";

import dynamic from "next/dynamic";

import { RouteMapPanel } from "@/shared/ui";

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
		<RouteMapPanel>
			<RouteMap stops={stops} />
		</RouteMapPanel>
	);
}
