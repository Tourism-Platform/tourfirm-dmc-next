import "server-only";

import { ENUM_PATH } from "@/shared/config";
import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import { CardType, type ICardItem } from "@/shared/ui/cards";

import {
	mapBlogToCard,
	mapExperienceToCard,
	mapNewsToCard,
	mapRouteToCard,
	mapTradeFairToCard
} from "./map-discovery-cards";
import type { Blog, Experience, News, Route, TradeFair } from "@/payload-types";

type TRelatedDocRelation = {
	relationTo: string;
	value: number | Record<string, unknown>;
};

function getPopulatedDoc(
	relatedDoc: unknown
): { relationTo: string; doc: Record<string, unknown> } | null {
	if (!relatedDoc || typeof relatedDoc !== "object") {
		return null;
	}

	if ("relationTo" in relatedDoc && "value" in relatedDoc) {
		const relation = relatedDoc as TRelatedDocRelation;
		const value = relation.value;

		if (typeof value === "object" && value !== null) {
			return { relationTo: relation.relationTo, doc: value };
		}
	}

	return null;
}

function formatPublishMeta(
	publishDate?: string | null,
	cardMeta?: string | null
): string | undefined {
	if (cardMeta) {
		return cardMeta;
	}

	if (!publishDate) {
		return undefined;
	}

	return new Date(publishDate).toLocaleDateString("en", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}

export function resolveRelatedDocToCardItem(relatedDoc: unknown): {
	type: CardType;
	item: ICardItem;
} | null {
	const populated = getPopulatedDoc(relatedDoc);

	if (!populated) {
		return null;
	}

	const { relationTo, doc } = populated;

	switch (relationTo) {
		case "routes": {
			const card = mapRouteToCard(doc as unknown as Route);

			return {
				type: CardType.Route,
				item: {
					href: card.href,
					imageUrl: card.imageUrl,
					badge: card.badge,
					meta: card.meta,
					title: card.title,
					description: card.description,
					cities: card.countries
				}
			};
		}
		case "experiences": {
			const card = mapExperienceToCard(doc as unknown as Experience);

			return {
				type: CardType.Experience,
				item: {
					href: card.href,
					imageUrl: card.imageUrl,
					badge: card.badge,
					title: card.title,
					description: card.description,
					meta: card.type,
					country: card.location
				}
			};
		}
		case "trade-fairs": {
			const card = mapTradeFairToCard(doc as unknown as TradeFair);

			return {
				type: CardType.TradeFair,
				item: {
					href: card.href,
					imageUrl: card.imageUrl,
					title: card.title,
					stand: card.stand,
					country: card.country,
					participants: card.participants
				}
			};
		}
		case "blog": {
			const card = mapBlogToCard(doc as unknown as Blog);

			return {
				type: CardType.Blog,
				item: {
					href: card.href,
					imageUrl: card.imageUrl,
					meta: card.meta,
					title: card.title
				}
			};
		}
		case "news": {
			const card = mapNewsToCard(doc as unknown as News);

			return {
				type: CardType.News,
				item: {
					href: card.href,
					imageUrl: card.imageUrl,
					meta: card.meta,
					title: card.title
				}
			};
		}
		case "journal-entries": {
			const title = typeof doc.title === "string" ? doc.title : "";
			const slug = typeof doc.slug === "string" ? doc.slug : "";

			return {
				type: CardType.Blog,
				item: {
					href: slug
						? ENUM_PATH.DISCOVERY.blogDetail(slug)
						: undefined,
					imageUrl: resolveMediaUrl(
						doc.coverImage as Parameters<typeof resolveMediaUrl>[0]
					),
					meta: formatPublishMeta(
						typeof doc.publishDate === "string"
							? doc.publishDate
							: null,
						typeof doc.cardMeta === "string" ? doc.cardMeta : null
					),
					title
				}
			};
		}
		default:
			return null;
	}
}
