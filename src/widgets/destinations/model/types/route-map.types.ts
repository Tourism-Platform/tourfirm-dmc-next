import type { TDestinationsI18nKey } from "./common.types";

export type TRouteMapStopConfig = {
	id: string;
	order: number;
	lat: number;
	lng: number;
	i18nKey: TDestinationsI18nKey;
};

export type TRouteMapStop = TRouteMapStopConfig & {
	name: string;
};
