import type { LatLngExpression } from "leaflet";

export type TRouteMapStop = {
	id: string;
	order: number;
	lat: number;
	lng: number;
	name: string;
};

export type TRouteMapProps = {
	stops: TRouteMapStop[];
	center: LatLngExpression;
	zoom: number;
	minZoom: number;
	maxZoom: number;
	tileUrl: string;
	tileAttribution: string;
};

export type TRouteMapViewProps = TRouteMapProps;
