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
	faq = "faq",
	timeline = "timeline",
	itinerary = "itinerary",
	routeLine = "routeLine",
	cta = "cta"
}

export type TColumnRatio =
	| "1:1"
	| "1:2"
	| "2:1"
	| "1:3"
	| "3:1"
	| "2:3"
	| "3:2"
	| "1:4"
	| "4:1"
	| "3:4"
	| "4:3"
	| "1:5"
	| "5:1"
	| "2:5"
	| "5:2"
	| "3:5"
	| "5:3"
	| "4:5"
	| "5:4";

export type TContentRow = {
	key?: string;
	ratio?: TColumnRatio;
	left?: TCardRenderProps[];
	right?: TCardRenderProps[];
};

export type TFaqQuestionProps = {
	key?: string;
	icon?: string;
	title: string;
	description: string;
};

export type TTimelineIndicatorType = "number" | "icon";

export type TTimelineItemProps = {
	key?: string;
	title: string;
	description?: string;
	date?: string;
	icon?: string;
};

export type TItineraryItemProps = {
	key?: string;
	title: string;
	description?: string;
	imageSrc?: string;
	meta?: string;
};

export type TRouteLineEndpointProps = {
	label?: string;
	title?: string;
	description?: string;
};

export type TRouteLineItemProps = {
	key?: string;
	title: string;
	description?: string;
};

export type TRouteMapAsideItemProps = {
	key?: string;
	title: string;
	description?: string;
	badge?: string;
};

export type TRouteMapAsideProps = {
	eyebrow?: string;
	title?: string;
	description?: string;
	items?: TRouteMapAsideItemProps[];
};

export type TRouteMapPanelHeaderProps = {
	eyebrow?: string;
	title?: string;
	description?: string;
	linkLabel?: string;
	linkHref?: string;
};

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
	rows?: TContentRow[];
	center?: LatLngExpression;
	zoom?: number;
	minZoom?: number;
	maxZoom?: number;
	tileUrl?: string;
	tileAttribution?: string;
	stops?: TRouteMapStop[];
	aside?: TRouteMapAsideProps;
	mapPanel?: TRouteMapPanelHeaderProps;
	questions?: TFaqQuestionProps[];
	indicatorType?: TTimelineIndicatorType;
	items?: TTimelineItemProps[];
	itineraryItems?: TItineraryItemProps[];
	start?: TRouteLineEndpointProps;
	end?: TRouteLineEndpointProps;
	routeLineItems?: TRouteLineItemProps[];
	emptyLabel?: string;
};
