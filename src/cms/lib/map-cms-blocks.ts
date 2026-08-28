import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import "server-only";

import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import {
	BlockType,
	type TBlockRenderProps,
	type TColumnRatio,
	type TContentRow
} from "@/shared/ui/blocks";
import {
	ActionType,
	type TButtonRenderProps
} from "@/shared/ui/buttons/types/button-render.types";
import { CardType, type TCardRenderProps } from "@/shared/ui/cards";
import type { TRouteMapStop } from "@/shared/ui/route-map";

import type {
	TCmsStaticCard,
	TEnrichedCmsBlock,
	TEnrichedCmsCard
} from "./resolve-block-data.types";
import type { Attraction, City, Country, Media, Region } from "@/payload-types";

type TCmsPageBlock = TEnrichedCmsBlock;
type TRouteMapBlock = Extract<TCmsPageBlock, { blockType: "routeMap" }>;
type TRouteMapStopRow = NonNullable<TRouteMapBlock["stops"]>[number];
type TRouteMapEntity = Country | Region | City | Attraction;

type TCmsAction = NonNullable<
	Extract<TCmsPageBlock, { blockType: "hero" }>["actions"]
>[number];

type TCmsRegularBlock = Extract<TCmsPageBlock, { blockType: "regular" }>;

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

function richTextToHtml(value: unknown): string | undefined {
	if (!value) {
		return undefined;
	}

	if (typeof value === "string") {
		return value;
	}

	return convertLexicalToHTML({
		data: value as Parameters<typeof convertLexicalToHTML>[0]["data"],
		disableContainer: true
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

	if (action.type === "form") {
		return {
			type: ActionType.form,
			item: {
				title: action.title,
				variant: action.variant ?? undefined
			}
		};
	}

	const href =
		action.type === "tel"
			? `tel:${action.phone ?? ""}`
			: (normalizeCmsHref(action.href) ?? "");

	return {
		type: ActionType.link,
		item: {
			title: action.title,
			href,
			variant: action.variant ?? undefined
		}
	};
}

function normalizeCmsHref(href: string | null | undefined): string | undefined {
	if (!href) {
		return undefined;
	}

	const trimmed = href.trim();

	if (!trimmed) {
		return undefined;
	}

	if (/^(https?:|tel:|mailto:|#)/i.test(trimmed)) {
		return trimmed;
	}

	// Strip accidental locale prefixes from CMS-authored hrefs (/ru/uzbekistan).
	const withoutLocale = trimmed.replace(
		/^\/(en|ru|uz|es|de|fr|it|pt|nl|pl|tr|ar|zh|ja|ko|hi)(?=\/|$)/,
		""
	);
	const path = withoutLocale.startsWith("/")
		? withoutLocale
		: `/${withoutLocale}`;

	return path === "" ? "/" : path;
}

function mapCmsCard(card: TEnrichedCmsCard, index: number): TCardRenderProps {
	if (card._enriched) {
		return card._enriched;
	}

	const staticCard = card as TCmsStaticCard;
	const cities =
		staticCard.cities
			?.map((city) => city.name)
			.filter((name): name is string => Boolean(name)) ?? [];

	const cardType =
		staticCard.type === "journal"
			? CardType.Blog
			: (staticCard.type as CardType);

	return {
		key: staticCard.id ?? String(index),
		type: cardType,
		item: {
			href: normalizeCmsHref(staticCard.href),
			imageUrl:
				(staticCard as { imageUrl?: string | null }).imageUrl ||
				resolveMediaUrl(
					staticCard.image as number | Media | null | undefined
				),
			badge: staticCard.badge ?? undefined,
			title: staticCard.title ?? undefined,
			description: richTextToPlain(staticCard.description),
			quoteHtml: richTextToHtml(staticCard.quote),
			meta: staticCard.meta ?? undefined,
			value: staticCard.value ?? undefined,
			cities,
			featured: staticCard.featured ?? undefined,
			ctaHref: normalizeCmsHref(staticCard.ctaHref),
			ctaLabel: staticCard.ctaLabel ?? undefined,
			stand: staticCard.stand ?? undefined,
			country: staticCard.country ?? undefined,
			participants: staticCard.participants ?? undefined,
			step: staticCard.step ?? undefined,
			icon: staticCard.icon ?? undefined,
			className: staticCard.className ?? undefined,
			rows: staticCard.rows?.map((row) => ({
				icon: row.icon ?? undefined,
				title: row.title,
				description: row.description ?? ""
			}))
		}
	};
}

function mapCmsContentRows(
	rows: NonNullable<TCmsRegularBlock["rows"]> | null | undefined
): TContentRow[] | undefined {
	if (!rows?.length) {
		return undefined;
	}

	return rows.map((row, index) => ({
		key: row.id ?? String(index),
		ratio: (row.ratio as TColumnRatio | null | undefined) ?? undefined,
		left: row.left?.map(mapCmsCard) ?? [],
		right: row.right?.map(mapCmsCard) ?? []
	}));
}

// routeMap stops need populated relation.value (title + coords).
// Leaf finders hydrate lean stop entities after depth 0 (avoid full related docs).
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

		case "regular": {
			const regularBlock = block as TCmsRegularBlock;

			return {
				blockType: BlockType.regular,
				eyebrow: regularBlock.eyebrow ?? undefined,
				title: regularBlock.title ?? undefined,
				description: richTextToPlain(regularBlock.description),
				gridClassName: regularBlock.gridClassName ?? undefined,
				displayMode:
					(regularBlock as { displayMode?: "grid" | "carousel" })
						.displayMode ?? "grid",
				actions: regularBlock.actions?.map(mapCmsAction),
				rows: mapCmsContentRows(regularBlock.rows),
				cards: regularBlock.cards?.map(mapCmsCard) ?? [],
				emptyLabel: regularBlock._emptyLabel
			};
		}

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

		case "mostPopularTours":
			return {
				blockType: BlockType.mostPopularTours,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description)
			};

		case "specialOffers":
			return {
				blockType: BlockType.specialOffers,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				actions: block.actions?.map(mapCmsAction)
			};

		case "routeMap": {
			const enrichedMap = block._enrichedMap;
			const latitude = block.mapCenter?.latitude;
			const longitude = block.mapCenter?.longitude;
			const stops = enrichedMap
				? enrichedMap.stops
				: (block.stops ?? [])
						.map((stop) => resolveStopFromRelation(stop))
						.filter((stop): stop is TRouteMapStop => stop !== null);
			const aside = block.aside;
			const mapPanel = block.mapPanel;
			const asideItems = aside?.items ?? [];
			const hasAside =
				Boolean(aside?.eyebrow) ||
				Boolean(aside?.title) ||
				Boolean(richTextToPlain(aside?.description)) ||
				asideItems.length > 0;

			return {
				blockType: BlockType.routeMap,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title ?? "",
				description: richTextToPlain(block.description),
				aside: hasAside
					? {
							eyebrow: aside?.eyebrow ?? undefined,
							title: aside?.title ?? undefined,
							description: richTextToPlain(aside?.description),
							items: asideItems.map((item, index) => ({
								key: item.id ?? String(index),
								title: item.title,
								description: richTextToPlain(item.description),
								badge: item.badge ?? undefined
							}))
						}
					: undefined,
				mapPanel: {
					eyebrow: mapPanel?.eyebrow ?? undefined,
					title: mapPanel?.title ?? undefined,
					description: richTextToPlain(mapPanel?.description),
					linkLabel: mapPanel?.linkLabel ?? undefined,
					linkHref: mapPanel?.linkHref ?? undefined
				},
				center: enrichedMap
					? enrichedMap.center
					: latitude != null && longitude != null
						? [latitude, longitude]
						: [41.2, 68.5],
				zoom: enrichedMap?.zoom ?? block.zoom ?? 6,
				minZoom: 4,
				maxZoom: 18,
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

		case "timeline":
			return {
				blockType: BlockType.timeline,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				indicatorType:
					block.indicatorType === "icon" ? "icon" : "number",
				items: (block.items ?? []).map((item, index) => ({
					key: item.id ?? String(index),
					title: item.title,
					description: richTextToPlain(item.description),
					date: item.date ?? undefined,
					icon: item.icon ?? undefined
				}))
			};

		case "itinerary":
			return {
				blockType: BlockType.itinerary,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				note: block.note ?? undefined,
				itineraryItems: (block.items ?? []).map((item, index) => ({
					key: item.id ?? String(index),
					title: item.title,
					description: richTextToPlain(item.description),
					imageSrc: resolveMediaUrl(
						item.image as number | Media | null | undefined
					),
					meta: richTextToPlain(item.meta)
				}))
			};

		case "routeLine":
			return {
				blockType: BlockType.routeLine,
				eyebrow: block.eyebrow ?? undefined,
				title: block.title,
				description: richTextToPlain(block.description),
				start: block.start
					? {
							label: block.start.label ?? undefined,
							title: block.start.title ?? undefined,
							description: richTextToPlain(
								block.start.description
							)
						}
					: undefined,
				end: block.end
					? {
							label: block.end.label ?? undefined,
							title: block.end.title ?? undefined,
							description: richTextToPlain(block.end.description)
						}
					: undefined,
				routeLineItems: (block.items ?? []).map((item, index) => ({
					key: item.id ?? String(index),
					title: item.title,
					description: richTextToPlain(item.description)
				}))
			};

		default:
			return null;
	}
}

export function mapCmsBlocks(
	blocks: TEnrichedCmsBlock[] | null | undefined
): TBlockRenderProps[] {
	if (!blocks?.length) {
		return [];
	}

	return blocks
		.map((block) => mapCmsBlock(block))
		.filter((block): block is TBlockRenderProps => block !== null);
}
