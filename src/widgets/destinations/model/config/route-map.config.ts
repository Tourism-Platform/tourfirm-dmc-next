import type { LatLngExpression, LatLngTuple } from "leaflet";

import { BlockType } from "@/shared/ui/blocks";

import type { TRouteMapStopConfig } from "../types/route-map.types";

export const ROUTE_MAP_CENTER: LatLngExpression = [41.2, 68.5];

export const ROUTE_MAP_ZOOM = 6;

export const ROUTE_MAP_MIN_ZOOM = 4;

export const ROUTE_MAP_MAX_ZOOM = 16;

export const ROUTE_MAP_BOUNDS: LatLngTuple[] = [
	[36.5, 53.5],
	[45.5, 79.5]
];

export const ROUTE_MAP_TILE_URL =
	"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export const ROUTE_MAP_TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const ROUTE_MAP_SECTION_CONFIG = {
	blockType: BlockType.routeMap,
	eyebrow: "route_map.eyebrow",
	title: "route_map.title",
	description: "route_map.description",
	center: ROUTE_MAP_CENTER,
	zoom: ROUTE_MAP_ZOOM,
	minZoom: ROUTE_MAP_MIN_ZOOM,
	maxZoom: ROUTE_MAP_MAX_ZOOM,
	tileUrl: ROUTE_MAP_TILE_URL,
	tileAttribution: ROUTE_MAP_TILE_ATTRIBUTION,
	stops: (t: (key: string) => string) =>
		ROUTE_MAP_STOPS.map(({ id, lat, lng, i18nKey }) => ({
			id,
			lat,
			lng,
			name: t(i18nKey)
		}))
};

export const ROUTE_MAP_STOPS: TRouteMapStopConfig[] = [
	{
		id: "almaty",
		lat: 43.238,
		lng: 76.9454,
		i18nKey: "countries.items.kazakhstan.cities.almaty"
	},
	{
		id: "bishkek",
		lat: 42.8746,
		lng: 74.5698,
		i18nKey: "countries.items.kyrgyzstan.cities.bishkek"
	},
	{
		id: "tashkent",
		lat: 41.2995,
		lng: 69.2401,
		i18nKey: "countries.items.uzbekistan.cities.tashkent"
	},
	{
		id: "samarkand",
		lat: 39.6542,
		lng: 66.9597,
		i18nKey: "countries.items.uzbekistan.cities.samarkand"
	},
	{
		id: "dushanbe",
		lat: 38.5598,
		lng: 68.787,
		i18nKey: "countries.items.tajikistan.cities.dushanbe"
	},
	{
		id: "ashgabat",
		lat: 37.9601,
		lng: 58.3261,
		i18nKey: "countries.items.turkmenistan.cities.ashgabat"
	}
];
