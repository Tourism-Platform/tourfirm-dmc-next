"use client";

import dynamic from "next/dynamic";

import { RouteMapPanel } from "@/shared/ui/cards";

import type { TRouteMapViewProps } from "../types";

const RouteMap = dynamic(
	() => import("./route-map").then((mod) => mod.RouteMap),
	{
		ssr: false,
		loading: () => (
			<div className="bg-muted h-full w-full animate-pulse" aria-hidden />
		)
	}
);

export function RouteMapView(props: TRouteMapViewProps) {
	return (
		<RouteMapPanel>
			<RouteMap {...props} />
		</RouteMapPanel>
	);
}
