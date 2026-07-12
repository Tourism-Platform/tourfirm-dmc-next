import "server-only";

import { CardType, type TCardRenderProps } from "@/shared/ui/cards";

import {
	mapAttractionToGeoCard,
	mapBlogToCard,
	mapCityToGeoCard,
	mapCountryToGeoCard,
	mapExperienceToCard,
	mapNewsToCard,
	mapRouteToCard,
	mapTradeFairToCard
} from "./map-discovery-cards";
import { extractMapPoints } from "./map-discovery-cards";
import {
	mapRoutePointsToStops,
	resolveRouteMapCenter
} from "./map-route-points";
import type {
	TCmsStaticCard,
	TEnrichedCmsBlock,
	TEnrichedCmsCard,
	TResolveBlockDataContext
} from "./resolve-block-data.types";
import { resolveRelatedDocToCardItem } from "./resolve-related-doc-card";
import type {
	Attraction,
	Blog,
	City,
	Country,
	Experience,
	News,
	Route,
	TradeFair
} from "@/payload-types";

const COLLECTION_RELATION: Record<string, string> = {
	blog: "blog",
	news: "news",
	routes: "routes",
	experiences: "experiences",
	"trade-fairs": "trade-fairs",
	similarExperiences: "experiences"
};

const GEO_FIELDS = new Set([
	"countries",
	"cities",
	"attractions",
	"country",
	"city",
	"attraction"
]);

function getPopulatedRelations(value: unknown): Record<string, unknown>[] {
	if (!value) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.filter(
			(item): item is Record<string, unknown> =>
				typeof item === "object" && item !== null
		);
	}

	if (typeof value === "object" && "docs" in value) {
		const docs = (value as { docs?: unknown[] }).docs ?? [];

		return docs.filter(
			(item): item is Record<string, unknown> =>
				typeof item === "object" && item !== null
		);
	}

	if (typeof value === "object") {
		return [value as Record<string, unknown>];
	}

	return [];
}

function toEnrichedCard(
	resolved: { type: CardType; item: TCardRenderProps["item"] },
	index: number
): TEnrichedCmsCard {
	return {
		id: String(index),
		type: resolved.type as TCmsStaticCard["type"],
		_enriched: {
			key: String(index),
			type: resolved.type,
			item: resolved.item
		}
	};
}

function resolveDocToCard(
	relationTo: string,
	doc: Record<string, unknown>,
	index: number
): TEnrichedCmsCard | null {
	const resolved = resolveRelatedDocToCardItem({
		relationTo,
		value: doc
	});

	if (!resolved) {
		return null;
	}

	return toEnrichedCard(resolved, index);
}

function resolveGeoFieldToCards(
	field: string,
	docs: Record<string, unknown>[],
	rootSlug: string
): TEnrichedCmsCard[] {
	return docs
		.map((doc, index) => {
			let geoCard;

			if (field === "countries" || field === "country") {
				geoCard = mapCountryToGeoCard(
					doc as unknown as Country,
					rootSlug
				);
			} else if (field === "cities" || field === "city") {
				geoCard = mapCityToGeoCard(doc as unknown as City, rootSlug);
			} else if (field === "attractions" || field === "attraction") {
				geoCard = mapAttractionToGeoCard(
					doc as unknown as Attraction,
					rootSlug
				);
			} else {
				return null;
			}

			return toEnrichedCard(
				{
					type: CardType.Country,
					item: {
						href: geoCard.href,
						imageUrl: geoCard.imageUrl,
						badge: geoCard.badge,
						title: geoCard.title,
						description: geoCard.description,
						cities: []
					}
				},
				index
			);
		})
		.filter((card): card is TEnrichedCmsCard => card !== null);
}

function resolveDocumentFieldCards(
	field: string,
	document: Record<string, unknown>,
	context: TResolveBlockDataContext
): TEnrichedCmsCard[] {
	const value = document[field];
	const docs = getPopulatedRelations(value);
	const rootSlug = context.navigation?.rootSlug ?? "destinations";

	if (GEO_FIELDS.has(field)) {
		return resolveGeoFieldToCards(field, docs, rootSlug);
	}

	if (field === "relatedRoutes") {
		return docs
			.map((doc, index) => resolveDocToCard("routes", doc, index))
			.filter((card): card is TEnrichedCmsCard => card !== null);
	}

	if (field === "experiences" || field === "relatedExperiences") {
		return docs.map((doc, index) =>
			toEnrichedCard(
				{
					type: CardType.Experience,
					item: mapExperienceCardItem(doc as unknown as Experience)
				},
				index
			)
		);
	}

	return [];
}

function mapExperienceCardItem(
	experience: Experience
): TCardRenderProps["item"] {
	const card = mapExperienceToCard(experience);

	return {
		href: card.href,
		imageUrl: card.imageUrl,
		badge: card.badge,
		title: card.title,
		description: card.description,
		meta: card.type,
		country: card.location
	};
}

function mapRouteCardItem(route: Route): TCardRenderProps["item"] {
	const card = mapRouteToCard(route);

	return {
		href: card.href,
		imageUrl: card.imageUrl,
		badge: card.badge,
		meta: card.meta,
		title: card.title,
		description: card.description,
		cities: card.countries
	};
}

function resolveCollectionCards(
	collectionKey: string,
	context: TResolveBlockDataContext
): TEnrichedCmsCard[] {
	const docs = context.collections?.[collectionKey] ?? [];
	const relationTo = COLLECTION_RELATION[collectionKey];

	if (!relationTo) {
		return [];
	}

	return docs
		.map((doc, index) => {
			if (typeof doc !== "object" || doc === null) {
				return null;
			}

			const record = doc as Record<string, unknown>;

			if (relationTo === "routes") {
				return toEnrichedCard(
					{
						type: CardType.Route,
						item: mapRouteCardItem(record as unknown as Route)
					},
					index
				);
			}

			if (relationTo === "experiences") {
				return toEnrichedCard(
					{
						type: CardType.Experience,
						item: mapExperienceCardItem(
							record as unknown as Experience
						)
					},
					index
				);
			}

			if (relationTo === "blog") {
				const card = mapBlogToCard(record as unknown as Blog);

				return toEnrichedCard(
					{
						type: CardType.Blog,
						item: {
							href: card.href,
							imageUrl: card.imageUrl,
							meta: card.meta,
							title: card.title
						}
					},
					index
				);
			}

			if (relationTo === "news") {
				const card = mapNewsToCard(record as unknown as News);

				return toEnrichedCard(
					{
						type: CardType.News,
						item: {
							href: card.href,
							imageUrl: card.imageUrl,
							meta: card.meta,
							title: card.title
						}
					},
					index
				);
			}

			if (relationTo === "trade-fairs") {
				const card = mapTradeFairToCard(record as unknown as TradeFair);

				return toEnrichedCard(
					{
						type: CardType.TradeFair,
						item: {
							href: card.href,
							imageUrl: card.imageUrl,
							title: card.title,
							stand: card.stand,
							country: card.country,
							participants: card.participants
						}
					},
					index
				);
			}

			return resolveDocToCard(relationTo, record, index);
		})
		.filter((card): card is TEnrichedCmsCard => card !== null);
}

function enrichRegularBlock(
	block: Extract<TEnrichedCmsBlock, { blockType: "regular" }>,
	context: TResolveBlockDataContext
): TEnrichedCmsBlock {
	const cardsSource = block.cardsSource;
	let cards = block.cards ?? [];
	let emptyLabel: string | undefined;

	if (cardsSource?.type === "documentField" && cardsSource.field) {
		cards = resolveDocumentFieldCards(
			cardsSource.field,
			context.document,
			context
		);
	} else if (cardsSource?.type === "collection" && cardsSource.collection) {
		cards = resolveCollectionCards(cardsSource.collection, context);
		emptyLabel = cardsSource.emptyLabel ?? undefined;
	} else {
		cards = (cards ?? []).map((card, index) => {
			if (!card.relatedDoc) {
				return card;
			}

			const resolved = resolveRelatedDocToCardItem(card.relatedDoc);

			if (!resolved) {
				return card;
			}

			return {
				...card,
				_enriched: {
					key: card.id ?? String(index),
					type: resolved.type,
					item: resolved.item
				}
			};
		});
	}

	return {
		...block,
		cards,
		_emptyLabel: emptyLabel
	} as TEnrichedCmsBlock;
}

function enrichRouteMapBlock(
	block: Extract<TEnrichedCmsBlock, { blockType: "routeMap" }>,
	context: TResolveBlockDataContext
): TEnrichedCmsBlock {
	const hasStops = (block.stops ?? []).length > 0;

	if (hasStops) {
		return block;
	}

	const mapPoints = extractMapPoints(context.document as unknown as Route);

	if (!mapPoints.length) {
		return block;
	}

	const stops = mapRoutePointsToStops(mapPoints);
	const center = resolveRouteMapCenter(mapPoints);

	if (!stops.length) {
		return block;
	}

	return {
		...block,
		_enrichedMap: {
			stops,
			center,
			zoom: block.zoom ?? 6
		}
	};
}

function enrichBlock(
	block: TEnrichedCmsBlock,
	context: TResolveBlockDataContext
): TEnrichedCmsBlock {
	if (block.blockType === "regular") {
		return enrichRegularBlock(block, context);
	}

	if (block.blockType === "routeMap") {
		return enrichRouteMapBlock(block, context);
	}

	if (block.blockType === "overviewStats") {
		return {
			...block,
			cards: (block.cards ?? []).map((card, index) => {
				if (!card.relatedDoc) {
					return card;
				}

				const resolved = resolveRelatedDocToCardItem(card.relatedDoc);

				if (!resolved) {
					return card;
				}

				return {
					...card,
					_enriched: {
						key: card.id ?? String(index),
						type: resolved.type,
						item: resolved.item
					}
				};
			})
		};
	}

	return block;
}

export function resolveBlockData(
	blocks: TEnrichedCmsBlock[] | null | undefined,
	context: TResolveBlockDataContext
): TEnrichedCmsBlock[] {
	if (!blocks?.length) {
		return [];
	}

	return blocks.map((block) => enrichBlock(block, context));
}
