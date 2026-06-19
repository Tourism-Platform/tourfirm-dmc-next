import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import {
	ActionType,
	type TButtonRenderProps
} from "@/shared/ui/buttons/types/button-render.types";
import { CardType, type TCardRenderProps } from "@/shared/ui/cards";
import type { TRouteMapStop } from "@/shared/ui/route-map";

import { resolveMediaUrl } from "./resolve-media-url";
import type {
	Attraction,
	City,
	Country,
	Homepage,
	Media,
	Region
} from "@/payload-types";

type TCmsPageBlock = NonNullable<Homepage["blocks"]>[number];
type TRouteMapBlock = Extract<TCmsPageBlock, { blockType: "routeMap" }>;
type TRouteMapStopRow = NonNullable<TRouteMapBlock["stops"]>[number];
type TRouteMapEntity = Country | Region | City | Attraction;

type TCmsCard = NonNullable<
	Extract<TCmsPageBlock, { blockType: "regular" }>["cards"]
>[number];
type TCmsAction = NonNullable<
	Extract<TCmsPageBlock, { blockType: "hero" }>["actions"]
>[number];

const ROUTE_MAP_TILE_URL =
	"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

const ROUTE_MAP_TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function richTextToPlain(value: unknown): string | undefined {
	if (!value) {
		return undefined;
	}

	if (typeof value === "string") {
		return value;
	}

	return convertLexicalToPlaintext({
		data: value as Parameters<typeof convertLexicalToPlaintext>[0]["data"]
	});
}

function mapCmsAction(action: TCmsAction): TButtonRenderProps {
	if (action.type === "mailto") {
		return {
			type: ActionType.mailto,
			item: {
				title: action.title,
				email: action.email ?? undefined,
				variant: action.variant ?? undefined
			}
		};
	}

	const href =
		action.type === "tel"
			? `tel:${action.phone ?? ""}`
			: (action.href ?? "");

	return {
		type: ActionType.link,
		item: {
			title: action.title,
			href,
			variant: action.variant ?? undefined
		}
	};
}

function mapCmsCard(card: TCmsCard, index: number): TCardRenderProps {
	const cities =
		card.cities
			?.map((city) => city.name)
			.filter((name): name is string => Boolean(name)) ?? [];

	return {
		key: card.id ?? String(index),
		type: card.type as CardType,
		item: {
			href: card.href ?? undefined,
			imageUrl: resolveMediaUrl(
				card.image as number | Media | null | undefined
			),
			badge: card.badge ?? undefined,
			title: card.title ?? undefined,
			description: richTextToPlain(card.description),
			meta: card.meta ?? undefined,
			value: card.value ?? undefined,
			cities,
			featured: card.featured ?? undefined,
			ctaHref: card.ctaHref ?? undefined,
			ctaLabel: card.ctaLabel ?? undefined,
			stand: card.stand ?? undefined,
			country: card.country ?? undefined,
			participants: card.participants ?? undefined,
			step: card.step ?? undefined,
			icon: card.icon ?? undefined,
			className: card.className ?? undefined
		}
	};
}

// routeMap requires populated stop.relation (depth >= 2 on document fetch).
// Unpopulated relation ID → stop skipped.
function getPopulatedRelationEntity(
	relation: TRouteMapStopRow["relation"]
): TRouteMapEntity | null {
	if (!relation || typeof relation !== "object" || !("value" in relation)) {
		return null;
	}

	const value = relation.value;

	if (typeof value !== "object" || value === null) {
		return null;
	}

	return value;
}

function getEntityCoordinates(
	entity: TRouteMapEntity
): { lat: number; lng: number } | null {
	if (
		"latitude" in entity &&
		entity.latitude != null &&
		entity.longitude != null
	) {
		return { lat: entity.latitude, lng: entity.longitude };
	}

	if (
		"mapCenter" in entity &&
		entity.mapCenter?.latitude != null &&
		entity.mapCenter?.longitude != null
	) {
		return {
			lat: entity.mapCenter.latitude,
			lng: entity.mapCenter.longitude
		};
	}

	return null;
}

function resolveStopFromRelation(stop: TRouteMapStopRow): TRouteMapStop | null {
	const entity = getPopulatedRelationEntity(stop.relation);

	if (!entity) {
		return null;
	}

	const coords = getEntityCoordinates(entity);

	if (!coords) {
		return null;
	}

	return {
		id: String(entity.id),
		lat: coords.lat,
		lng: coords.lng,
		name: entity.title ?? ""
	};
}

function mapCmsBlock(block: TCmsPageBlock): TBlockRenderProps | null {
	switch (block.blockType) {
		case "hero":
			return {
				blockType: BlockType.hero,
				imageSrc: resolveMediaUrl(block.image),
				imageAlt: block.imageAlt ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				note: block.note ?? undefined,
				actions: block.actions?.map(mapCmsAction)
			};

		case "overviewStats":
			return {
				blockType: BlockType.overviewStats,
				cards: block.cards?.map(mapCmsCard) ?? []
			};

		case "regular":
			return {
				blockType: BlockType.regular,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				gridClassName: block.gridClassName ?? undefined,
				actions: block.actions?.map(mapCmsAction),
				cards: block.cards?.map(mapCmsCard) ?? []
			};

		case "cta":
			return {
				blockType: BlockType.cta,
				imageSrc: block.image
					? resolveMediaUrl(
							block.image as number | Media | null | undefined
						)
					: undefined,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title ?? undefined,
				description: richTextToPlain(block.description),
				actions: block.actions?.map(mapCmsAction)
			};

		case "routeMap": {
			// INVARIANT: routeMap stop order = CMS block.stops[] array order only.
			// Do NOT sort, reorder, or add order/index/position fields.
			const latitude = block.mapCenter?.latitude;
			const longitude = block.mapCenter?.longitude;
			const stops = (block.stops ?? [])
				.map((stop) => resolveStopFromRelation(stop))
				.filter((stop): stop is TRouteMapStop => stop !== null);

			return {
				blockType: BlockType.routeMap,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title ?? "",
				description: richTextToPlain(block.description),
				center:
					latitude != null && longitude != null
						? [latitude, longitude]
						: [41.2, 68.5],
				zoom: block.zoom ?? 6,
				minZoom: 4,
				maxZoom: 8,
				tileUrl: ROUTE_MAP_TILE_URL,
				tileAttribution: ROUTE_MAP_TILE_ATTRIBUTION,
				stops
			};
		}

		case "faq":
			return {
				blockType: BlockType.faq,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				questions: (block.questions ?? []).map((question, index) => ({
					key: question.id ?? String(index),
					icon: question.icon ?? undefined,
					title: question.title,
					description: richTextToPlain(question.description) ?? ""
				}))
			};

		default:
			return null;
	}
}

export function mapCmsBlocks(
	blocks: TCmsPageBlock[] | null | undefined
): TBlockRenderProps[] {
	if (!blocks?.length) {
		return [];
	}

	return blocks
		.map((block) => mapCmsBlock(block))
		.filter((block): block is TBlockRenderProps => block !== null);
}
