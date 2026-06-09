import type { TMainI18nKey } from "./common.types";

export type TMainRouteId = "essentials" | "silk_road" | "regional";

export type TMainRouteI18n = {
	badge: TMainI18nKey;
	meta: TMainI18nKey;
	title: TMainI18nKey;
	description: TMainI18nKey;
};

export type TMainRouteConfig = {
	id: TMainRouteId;
	imageUrl: string;
	ctaHref: string;
	i18n: TMainRouteI18n;
};

export const MAIN_ROUTE_I18N: Record<TMainRouteId, TMainRouteI18n> = {
	essentials: {
		badge: "featured_routes.items.essentials.badge",
		meta: "featured_routes.items.essentials.meta",
		title: "featured_routes.items.essentials.title",
		description: "featured_routes.items.essentials.description"
	},
	silk_road: {
		badge: "featured_routes.items.silk_road.badge",
		meta: "featured_routes.items.silk_road.meta",
		title: "featured_routes.items.silk_road.title",
		description: "featured_routes.items.silk_road.description"
	},
	regional: {
		badge: "featured_routes.items.regional.badge",
		meta: "featured_routes.items.regional.meta",
		title: "featured_routes.items.regional.title",
		description: "featured_routes.items.regional.description"
	}
};
