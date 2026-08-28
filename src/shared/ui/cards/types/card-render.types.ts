import type { LucideIcon } from "lucide-react";

export enum CardType {
	Country = "country",
	DestinationInsight = "destinationInsight",
	TeamMember = "teamMember",
	RouteIdea = "routeIdea",
	Route = "route",
	Experience = "experience",
	TradeFair = "tradeFair",
	Blog = "blog",
	News = "news",
	/** @deprecated Use CardType.Blog */
	Journal = "journal",
	OverviewStat = "overviewStat",
	ServicesBusiness = "servicesBusiness",
	ServicesDirection = "servicesDirection",
	ServicesProcess = "servicesProcess",
	TripFormat = "tripFormat",
	DashTitle = "dashTitle",
	Quote = "quote",
	Alert = "alert",
	MiniTable = "miniTable",
	Portrait = "portrait",
	CatalogFeed = "catalogFeed",
	TourDestination = "tourDestination"
}

export type TCardItemRow = {
	icon?: LucideIcon | string;
	title: string;
	description: string;
};

export interface ICardItem {
	href?: string;
	imageUrl?: string;
	badge?: string;
	title?: string;
	description?: string;
	meta?: string;
	value?: string;
	cities?: string[];
	featured?: boolean;
	ctaHref?: string;
	ctaLabel?: string;
	stand?: string;
	country?: string;
	participants?: string;
	step?: string;
	icon?: LucideIcon | string;
	className?: string;
	quoteHtml?: string;
	rows?: TCardItemRow[];
	readMoreLabel?: string;
}

export type TCardRenderProps = {
	key?: string;
	type: CardType;
	item: ICardItem;
};
