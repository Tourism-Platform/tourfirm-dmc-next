import "server-only";

import { ENUM_PATH } from "@/shared/config";
import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import { CardType, type ICardItem } from "@/shared/ui/cards";

import { getCollectionCardConfig } from "@/cms/routing/collection-card.registry";

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
	const cardConfig = getCollectionCardConfig(relationTo);

	if (cardConfig) {
		return {
			type: cardConfig.cardType,
			item: cardConfig.mapToCard(doc)
		};
	}

	switch (relationTo) {
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
