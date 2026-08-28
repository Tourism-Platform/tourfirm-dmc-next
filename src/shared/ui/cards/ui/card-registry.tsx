import type { ReactNode } from "react";

import { getLucideIcon } from "@/shared/lib/get-lucide-icon";

import { CardType, type ICardItem } from "../types/card-render.types";

import { BlogCard } from "./blog-card";
import { CatalogFeedCard } from "./catalog-feed-card";
import { CountryCard } from "./country-card";
import { DashTitleCard } from "./dash-title-card";
import { DestinationInsightCard } from "./destination-insight-card";
import { ExperienceCard } from "./experience-card";
import { InsightAlertCard } from "./insight-alert-card";
import { MiniTableCard } from "./mini-table-card";
import { NewsCard } from "./news-card";
import { OverviewStatCard } from "./overview-stat-card";
import { PortraitCard } from "./portrait-card";
import { QuoteCard } from "./quote-card";
import { RouteCard } from "./route-card";
import { RouteIdeaCard } from "./route-idea-card";
import { ServicesBusinessCard } from "./services-business-card";
import { ServicesDirectionCard } from "./services-direction-card";
import { ServicesProcessCard } from "./services-process-card";
import { TeamMemberCard } from "./team-member-card";
import { TourDestinationCard } from "./tour-destination-card";
import { TradeFairCard } from "./trade-fair-card";
import { TripFormatCard } from "./trip-format-card";

type TCardRenderer = (item: ICardItem) => ReactNode;

function renderRouteCard(item: ICardItem): ReactNode {
	if (!item.href) {
		return null;
	}

	return (
		<RouteCard
			data={{
				href: item.href,
				imageUrl: item.imageUrl ?? "",
				badge: item.badge ?? "Route",
				meta: item.meta ?? "",
				title: item.title ?? "",
				description: item.description ?? "",
				countries: item.cities ?? [],
				themes: []
			}}
		/>
	);
}

function renderJournalOrBlog(item: ICardItem): ReactNode {
	return (
		<BlogCard
			data={{
				href: item.href ?? "",
				imageUrl: item.imageUrl ?? "",
				meta: item.meta ?? "",
				title: item.title ?? ""
			}}
		/>
	);
}

export const CARD_REGISTRY: Partial<Record<CardType, TCardRenderer>> = {
	[CardType.Country]: (item) => (
		<CountryCard
			data={{
				href: item.href ?? "",
				imageUrl: item.imageUrl ?? "",
				badge: item.badge ?? "",
				title: item.title ?? "",
				description: item.description ?? "",
				cities: item.cities ?? [],
				featured: item.featured,
				className: item.className
			}}
		/>
	),
	[CardType.TourDestination]: (item) => (
		<TourDestinationCard
			data={{
				href: item.href ?? "",
				imageUrl: item.imageUrl ?? "",
				badge: item.badge,
				title: item.title ?? "",
				description: item.description,
				cities: item.cities,
				featured: item.featured,
				className: item.className
			}}
		/>
	),
	[CardType.DestinationInsight]: (item) => (
		<DestinationInsightCard
			data={{
				icon: getLucideIcon(item.icon),
				title: item.title ?? "",
				description: item.description
			}}
		/>
	),
	[CardType.TeamMember]: (item) => (
		<TeamMemberCard
			data={{
				icon: getLucideIcon(item.icon),
				title: item.title ?? "",
				description: item.description ?? "",
				href: item.href ?? ""
			}}
		/>
	),
	[CardType.RouteIdea]: (item) => (
		<RouteIdeaCard
			data={{
				imageUrl: item.imageUrl ?? "",
				badge: item.badge ?? "",
				meta: item.meta ?? "",
				title: item.title ?? "",
				description: item.description ?? "",
				ctaHref: item.ctaHref ?? "",
				ctaLabel: item.ctaLabel ?? ""
			}}
		/>
	),
	[CardType.Route]: renderRouteCard,
	[CardType.Experience]: (item) => (
		<ExperienceCard
			data={{
				href: item.href,
				imageUrl: item.imageUrl ?? "",
				badge: item.badge ?? "",
				title: item.title ?? "",
				description: item.description ?? "",
				type: item.meta,
				location: item.country
			}}
		/>
	),
	[CardType.TradeFair]: (item) => (
		<TradeFairCard
			data={{
				href: item.href,
				imageUrl: item.imageUrl,
				title: item.title ?? "",
				stand: item.stand ?? "",
				country: item.country ?? "",
				participants: item.participants ?? ""
			}}
		/>
	),
	[CardType.Blog]: renderJournalOrBlog,
	[CardType.Journal]: renderJournalOrBlog,
	[CardType.News]: (item) => (
		<NewsCard
			data={{
				href: item.href ?? "",
				imageUrl: item.imageUrl ?? "",
				meta: item.meta ?? "",
				title: item.title ?? ""
			}}
		/>
	),
	[CardType.OverviewStat]: (item) => (
		<OverviewStatCard
			icon={getLucideIcon(item.icon)}
			value={item.value ?? ""}
		/>
	),
	[CardType.ServicesBusiness]: (item) => (
		<ServicesBusinessCard
			badge={item.badge ?? ""}
			title={item.title ?? ""}
			description={item.description ?? ""}
			icon={getLucideIcon(item.icon)}
			className={item.className}
		/>
	),
	[CardType.ServicesDirection]: (item) => (
		<ServicesDirectionCard
			imageUrl={item.imageUrl ?? ""}
			title={item.title ?? ""}
			description={item.description ?? ""}
			ctaLabel={item.ctaLabel ?? ""}
		/>
	),
	[CardType.ServicesProcess]: (item) => (
		<ServicesProcessCard
			step={item.step ?? ""}
			title={item.title ?? ""}
			description={item.description ?? ""}
		/>
	),
	[CardType.TripFormat]: (item) => (
		<TripFormatCard
			data={{
				id: "",
				badge: item.badge ?? "",
				icon: getLucideIcon(item.icon),
				title: item.title ?? "",
				description: item.description ?? ""
			}}
		/>
	),
	[CardType.DashTitle]: (item) => (
		<DashTitleCard
			data={{
				title: item.title ?? "",
				description: item.description ?? ""
			}}
		/>
	),
	[CardType.Quote]: (item) => (
		<QuoteCard
			data={{
				quoteHtml: item.quoteHtml ?? ""
			}}
		/>
	),
	[CardType.Alert]: (item) => (
		<InsightAlertCard
			data={{
				title: item.title ?? "",
				description: item.description ?? ""
			}}
		/>
	),
	[CardType.MiniTable]: (item) => (
		<MiniTableCard
			data={{
				title: item.title ?? "",
				icon: item.icon ? getLucideIcon(item.icon) : undefined,
				rows: (item.rows ?? []).map((row) => ({
					icon: getLucideIcon(row.icon),
					title: row.title,
					description: row.description
				}))
			}}
		/>
	),
	[CardType.Portrait]: (item) => (
		<PortraitCard
			data={{
				imageUrl: item.imageUrl ?? "",
				imageAlt: item.title ?? "",
				title: undefined,
				description: item.description
			}}
		/>
	),
	[CardType.CatalogFeed]: (item) => <CatalogFeedCard data={item} />
};
