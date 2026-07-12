import { CardType, type ICardItem } from "@/shared/ui/cards";

import { buildCmsRoutePath } from "./build-cms-route-path";
import {
	mapBlogToCard,
	mapExperienceToCard,
	mapNewsToCard,
	mapRouteToCard,
	mapTradeFairToCard
} from "@/cms/lib/map-discovery-cards";

export type TCollectionCardEntry = {
	cardType: CardType;
	relationTo: string;
	routeKey: string;
	mapToCard: (doc: unknown) => ICardItem;
	buildHref: (slug: string) => string;
};

export const COLLECTION_CARD_REGISTRY: Record<string, TCollectionCardEntry> = {
	blog: {
		cardType: CardType.Blog,
		relationTo: "blog",
		routeKey: "blog",
		mapToCard: (doc) =>
			mapBlogToCard(doc as Parameters<typeof mapBlogToCard>[0]),
		buildHref: (slug) => buildCmsRoutePath("blog", { slug })
	},
	news: {
		cardType: CardType.News,
		relationTo: "news",
		routeKey: "company-news",
		mapToCard: (doc) =>
			mapNewsToCard(doc as Parameters<typeof mapNewsToCard>[0]),
		buildHref: (slug) => buildCmsRoutePath("company-news", { slug })
	},
	routes: {
		cardType: CardType.Route,
		relationTo: "routes",
		routeKey: "routes",
		mapToCard: (doc) =>
			mapRouteToCard(doc as Parameters<typeof mapRouteToCard>[0]),
		buildHref: (slug) => buildCmsRoutePath("routes", { slug })
	},
	experiences: {
		cardType: CardType.Experience,
		relationTo: "experiences",
		routeKey: "experiences",
		mapToCard: (doc) =>
			mapExperienceToCard(
				doc as Parameters<typeof mapExperienceToCard>[0]
			),
		buildHref: (slug) => buildCmsRoutePath("experiences", { slug })
	},
	"trade-fairs": {
		cardType: CardType.TradeFair,
		relationTo: "trade-fairs",
		routeKey: "company-trade-fairs",
		mapToCard: (doc) =>
			mapTradeFairToCard(doc as Parameters<typeof mapTradeFairToCard>[0]),
		buildHref: (slug) => buildCmsRoutePath("company-trade-fairs", { slug })
	}
};

export function getCollectionCardConfig(
	collection: string
): TCollectionCardEntry | undefined {
	return COLLECTION_CARD_REGISTRY[collection];
}
