import { BlockType, type TBlockRenderProps } from "@/shared/ui/blocks";
import {
	ActionType,
	type TButtonRenderProps
} from "@/shared/ui/buttons/types/button-render.types";
import { CardType, type TCardRenderProps } from "@/shared/ui/cards";

import { resolveMediaUrl } from "./resolve-media-url";
import type { Homepage, Media } from "@/payload-types";

type TCmsPageBlock = NonNullable<Homepage["blocks"]>[number];
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
			description: card.description ?? undefined,
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

function mapCmsBlock(block: TCmsPageBlock): TBlockRenderProps | null {
	switch (block.blockType) {
		case "hero":
			return {
				blockType: BlockType.hero,
				imageSrc: resolveMediaUrl(block.image),
				imageAlt: block.imageAlt ?? undefined,
				title: block.title,
				description: block.description ?? undefined,
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
				description: block.description ?? undefined,
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
				description: block.description ?? undefined,
				actions: block.actions?.map(mapCmsAction)
			};

		case "routeMap": {
			const latitude = block.mapCenter?.latitude;
			const longitude = block.mapCenter?.longitude;

			return {
				blockType: BlockType.routeMap,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title ?? "",
				description: block.description ?? undefined,
				center:
					latitude != null && longitude != null
						? [latitude, longitude]
						: [41.2, 68.5],
				zoom: block.zoom ?? 6,
				minZoom: 4,
				maxZoom: 8,
				tileUrl: ROUTE_MAP_TILE_URL,
				tileAttribution: ROUTE_MAP_TILE_ATTRIBUTION,
				stops: []
			};
		}

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
		.map(mapCmsBlock)
		.filter((block): block is TBlockRenderProps => block !== null);
}
