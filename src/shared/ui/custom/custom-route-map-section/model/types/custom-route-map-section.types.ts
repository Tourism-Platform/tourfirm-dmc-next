import type { LatLngExpression } from "leaflet";

import type {
	TRouteMapAsideProps,
	TRouteMapPanelHeaderProps
} from "@/shared/ui/blocks/types/block-render.types";
import type { TRouteMapStop } from "@/shared/ui/route-map";

export type TRouteMapSectionProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	aside?: TRouteMapAsideProps;
	mapPanel?: TRouteMapPanelHeaderProps;
	stops: TRouteMapStop[];
	center: LatLngExpression;
	zoom: number;
	minZoom: number;
	maxZoom: number;
	tileUrl: string;
	tileAttribution: string;
};
