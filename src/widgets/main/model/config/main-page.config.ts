import {
	Briefcase,
	Gauge,
	Heart,
	Link2,
	type LucideIcon,
	Route,
	User,
	Users
} from "lucide-react";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { ActionType } from "@/shared/ui/buttons/types/button-render.types";
import { CardType } from "@/shared/ui/cards/types/card-render.types";

import { BlockType } from "@/shared/ui/blocks";

import { type TMainPageConfig } from "../types/main-page.types";
import type { TTripFormatId } from "../types/trip-formats.types";
import type { TMainWhyId } from "../types/why.types";

import { MAIN_COUNTRIES_CONFIG } from "./countries.config";
import { MAIN_EXPERIENCES_CONFIG } from "./experiences.config";
import { MAIN_FEATURED_ROUTES_CONFIG } from "./featured-routes.config";
import { MAIN_JOURNAL_CONFIG } from "./journal.config";
import { MAIN_TRADE_FAIRS_CONFIG } from "./trade-fairs.config";
import { MAIN_TRIP_FORMATS_CONFIG } from "./trip-formats.config";
import { MAIN_WHY_CONFIG } from "./why.config";
import { MAIN_OVERVIEW_STATS_CONFIG } from "./overview-stats.config";
import { MAIN_CTA_IMAGE, MAIN_HERO_IMAGE } from "./destination-images.config";

const WHY_ICONS: Record<TMainWhyId, LucideIcon> = {
	programs: Route,
	rhythm: Gauge,
	connection: Link2
};

const FORMAT_ICONS: Record<TTripFormatId, LucideIcon> = {
	private: User,
	group: Users,
	family: Heart,
	mice: Briefcase
};

export const MAIN_PAGE_CONFIG: TMainPageConfig = {
	sections: [
		{
			blockType: BlockType.hero,
			imageSrc: MAIN_HERO_IMAGE,
			title: "hero.title",
			description: "hero.description",
			note: "hero.note",
			actions: [{

				type: ActionType.mailto,
				item: {
				variant: "default",
				email: "info@tourlink.uz",
				title: "hero.cta_contact"
				},
			}, {
				type: ActionType.link,
				item: {
					variant: ActionType.link,
					href: ENUM_PATH.MAIN.DESTINATIONS,
					title: "hero.cta_destinations"
				}
			}]
		},
		{
			blockType: BlockType.overviewStats,
			cards: (t) =>
				MAIN_OVERVIEW_STATS_CONFIG.map((stat) => ({
					type: CardType.OverviewStat,
					item: {
						icon: stat.icon,
						value: t(stat.i18n.value)
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "countries.eyebrow",
			title: "countries.title",
			description: "countries.description",
			gridClassName: "sm:grid-cols-2 sm:gap-5 lg:gap-6",
			actions: [{
				type: ActionType.link,
				item: {
					variant: "outline",
					href: ENUM_PATH.MAIN.DESTINATIONS,
					title: "countries.view_all"
				}
			}],
			cards: (t) =>
				MAIN_COUNTRIES_CONFIG.map((country) => ({
					key: country.id,
					type: CardType.Country,
					item: {
						href: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
							destination: country.catalogDestination
						}),
						imageUrl: country.imageUrl,
						badge: t(country.i18n.badge),
						title: t(country.i18n.name),
						description: t(country.i18n.description),
						cities: [],
						featured: country.id === "uzbekistan"
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "experiences.eyebrow",
			title: "experiences.title",
			description: "experiences.description",
			gridClassName: "sm:grid-cols-2 lg:grid-cols-3",
			cards: (t) =>
				MAIN_EXPERIENCES_CONFIG.map((item) => ({
					key: item.id,
					type: CardType.Experience,
					item: {
						imageUrl: item.imageUrl,
						badge: t(item.i18n.badge),
						title: t(item.i18n.title),
						description: t(item.i18n.description)
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "trip_formats.eyebrow",
			title: "trip_formats.title",
			description: "trip_formats.description",
			gridClassName: "md:grid-cols-2 lg:grid-cols-4",
			cards: (t) =>
				MAIN_TRIP_FORMATS_CONFIG.map((item) => ({
					key: item.id,
					type: CardType.TripFormat,
					item: {
						badge: t(item.i18n.badge),
						icon: FORMAT_ICONS[item.id],
						title: t(item.i18n.title),
						description: t(item.i18n.description)
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "featured_routes.eyebrow",
			title: "featured_routes.title",
			description: "featured_routes.description",
			cards: (t) =>
				MAIN_FEATURED_ROUTES_CONFIG.map((route) => ({
					key: route.id,
					type: CardType.RouteIdea,
					item: {
						imageUrl: route.imageUrl,
						badge: t(route.i18n.badge),
						meta: t(route.i18n.meta),
						title: t(route.i18n.title),
						description: t(route.i18n.description),
						ctaHref: route.ctaHref,
						ctaLabel: t("featured_routes.cta")
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "why.eyebrow",
			title: "why.title",
			cards: (t) =>
				MAIN_WHY_CONFIG.map((item) => ({
					key: item.id,
					type: CardType.DestinationInsight,
					item: {
						icon: WHY_ICONS[item.id],
						title: t(item.i18n.title),
						description: t(item.i18n.description)
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "trade_fairs.eyebrow",
			title: "trade_fairs.title",
			description: "trade_fairs.description",
			cards: (t) => MAIN_TRADE_FAIRS_CONFIG.map((item) => ({
					key: item.id,
					type: CardType.TradeFair,
					item: {
						title: t(item.i18n.title),
						stand: t(item.i18n.stand),
						participants: t(item.i18n.participants),
						country: t(item.i18n.country)
					}
				}))
		},
		{
			blockType: BlockType.regular,
			eyebrow: "journal.eyebrow",
			title: "journal.title",
			description: "journal.description",
			cards: (t) =>
				MAIN_JOURNAL_CONFIG.map((item) => ({
					key: item.id,
					type: CardType.Journal,
					item: {
						imageUrl: item.imageUrl,
						meta: t(item.i18n.meta),
						title: t(item.i18n.title)
					}
				}))
		},
		{
			blockType: BlockType.cta,
			imageSrc: MAIN_CTA_IMAGE,
			eyebrow: "cta.eyebrow",
			title: "cta.title",
			description: "cta.description",
			actions: [{
				type: ActionType.mailto,
				item: {
					variant: "default",
					email: "info@tourlink.uz",
					title: "cta.primary"
				}
			}, {
				type: ActionType.link,
				item: {
					variant: "outline",
					href: ENUM_PATH.MAIN.DESTINATIONS,
					title: "cta.secondary"
				}
			}]
		}
	]
};
