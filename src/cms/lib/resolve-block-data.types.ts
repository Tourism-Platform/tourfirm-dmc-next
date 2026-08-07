import type { TCardRenderProps } from "@/shared/ui/cards";
import type { TRouteMapStop } from "@/shared/ui/route-map";

import type { Homepage, Tour } from "@/payload-types";

export type TCmsPageBlock =
	| NonNullable<Homepage["blocks"]>[number]
	| NonNullable<Tour["blocks"]>[number];

export type TResolveBlockDataContext = {
	document: Record<string, unknown>;
	locale: string;
	collections?: Record<string, unknown[]>;
	query?: Record<string, string | undefined>;
	navigation?: {
		rootSlug?: string;
	};
};

type TRegularBlock = Extract<TCmsPageBlock, { blockType: "regular" }>;

export type TCmsStaticCard = NonNullable<TRegularBlock["cards"]>[number];

export type TEnrichedCmsCard = TCmsStaticCard & {
	_enriched?: TCardRenderProps;
};

export type TEnrichedRouteMapData = {
	stops: TRouteMapStop[];
	center: [number, number];
	zoom?: number;
};

export type TEnrichedCmsBlock = TCmsPageBlock & {
	_enrichedMap?: TEnrichedRouteMapData;
	_emptyLabel?: string;
};
