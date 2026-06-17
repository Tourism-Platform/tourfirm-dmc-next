import type { LatLngExpression } from "leaflet";
import type { ReactNode } from "react";

import type { TButtonRenderProps } from "@/shared/ui/buttons/types/button-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";
import type { TRouteMapStop } from "@/shared/ui/route-map";

export enum BlockType {
	hero = "hero",
	overviewStats = "overviewStats",
	regular = "regular",
	routeMap = "routeMap",
	cta = "cta"
}

export type TBlockRenderProps = {
	blockType: BlockType;
	eyebrow?: string;
	title?: string;
	note?: string;
	description?: string;
	gridClassName?: string;
	imageSrc?: string;
	imageAlt?: string;
	children?: ReactNode;
	actions?: TButtonRenderProps[];
	cards?: TCardRenderProps[];
	center?: LatLngExpression;
	zoom?: number;
	minZoom?: number;
	maxZoom?: number;
	tileUrl?: string;
	tileAttribution?: string;
	stops?: TRouteMapStop[];
};
