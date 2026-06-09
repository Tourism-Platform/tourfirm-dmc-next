import type { TDestinationsI18nKey } from "./common.types";

export type TRouteIdeaId = "uzbekistan_intro" | "uz_kg" | "regional";

export type TRouteIdeaI18n = {
	badge: TDestinationsI18nKey;
	meta: TDestinationsI18nKey;
	title: TDestinationsI18nKey;
	description: TDestinationsI18nKey;
};

export type TRouteIdeaConfig = {
	id: TRouteIdeaId;
	imageUrl: string;
	ctaHref: string;
	i18n: TRouteIdeaI18n;
};

export const ROUTE_IDEAS_I18N: Record<TRouteIdeaId, TRouteIdeaI18n> = {
	uzbekistan_intro: {
		badge: "route_ideas.items.uzbekistan_intro.badge",
		meta: "route_ideas.items.uzbekistan_intro.meta",
		title: "route_ideas.items.uzbekistan_intro.title",
		description: "route_ideas.items.uzbekistan_intro.description"
	},
	uz_kg: {
		badge: "route_ideas.items.uz_kg.badge",
		meta: "route_ideas.items.uz_kg.meta",
		title: "route_ideas.items.uz_kg.title",
		description: "route_ideas.items.uz_kg.description"
	},
	regional: {
		badge: "route_ideas.items.regional.badge",
		meta: "route_ideas.items.regional.meta",
		title: "route_ideas.items.regional.title",
		description: "route_ideas.items.regional.description"
	}
};
