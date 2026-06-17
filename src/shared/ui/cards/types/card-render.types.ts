import type { LucideIcon } from "lucide-react";

export enum CardVariant {
	Country = "country",
	DestinationInsight = "destinationInsight",
	RouteIdea = "routeIdea",
	Experience = "experience",
	TradeFair = "tradeFair",
	Journal = "journal",
	OverviewStat = "overviewStat",
	ServicesBusiness = "servicesBusiness",
	ServicesDirection = "servicesDirection",
	ServicesProcess = "servicesProcess"
}

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
	icon?: LucideIcon;
	className?: string;
}

export type TCardRenderProps = {
	variant: CardVariant;
	item: ICardItem;
};
