import { CardVariant, type TCardRenderProps } from "../types/card-render.types";

import { CountryCard } from "./country-card";
import { DestinationInsightCard } from "./destination-insight-card";
import { ExperienceCard } from "./experience-card";
import { JournalCard } from "./journal-card";
import { OverviewStatCard } from "./overview-stat-card";
import { RouteIdeaCard } from "./route-idea-card";
import { ServicesBusinessCard } from "./services-business-card";
import { ServicesDirectionCard } from "./services-direction-card";
import { ServicesProcessCard } from "./services-process-card";
import { TradeFairCard } from "./trade-fair-card";

export function CardRender({ variant, item }: TCardRenderProps) {
	switch (variant) {
		case CardVariant.Country:
			return (
				<CountryCard
					data={{
						href: item.href ?? "",
						imageUrl: item.imageUrl ?? "",
						badge: item.badge ?? "",
						title: item.title ?? "",
						description: item.description ?? "",
						cities: item.cities ?? [],
						featured: item.featured
					}}
				/>
			);
		case CardVariant.DestinationInsight:
			return (
				<DestinationInsightCard
					data={{
						icon: item.icon!,
						title: item.title ?? "",
						description: item.description ?? ""
					}}
				/>
			);
		case CardVariant.RouteIdea:
			return (
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
			);
		case CardVariant.Experience:
			return (
				<ExperienceCard
					data={{
						imageUrl: item.imageUrl ?? "",
						badge: item.badge ?? "",
						title: item.title ?? "",
						description: item.description ?? ""
					}}
				/>
			);
		case CardVariant.TradeFair:
			return (
				<TradeFairCard
					data={{
						title: item.title ?? "",
						stand: item.stand ?? "",
						country: item.country ?? "",
						participants: item.participants ?? ""
					}}
				/>
			);
		case CardVariant.Journal:
			return (
				<JournalCard
					data={{
						imageUrl: item.imageUrl ?? "",
						meta: item.meta ?? "",
						title: item.title ?? ""
					}}
				/>
			);
		case CardVariant.OverviewStat:
			return (
				<OverviewStatCard icon={item.icon!} value={item.value ?? ""} />
			);
		case CardVariant.ServicesBusiness:
			return (
				<ServicesBusinessCard
					badge={item.badge ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
					icon={item.icon!}
					className={item.className}
				/>
			);
		case CardVariant.ServicesDirection:
			return (
				<ServicesDirectionCard
					imageUrl={item.imageUrl ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
					ctaLabel={item.ctaLabel ?? ""}
				/>
			);
		case CardVariant.ServicesProcess:
			return (
				<ServicesProcessCard
					step={item.step ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
				/>
			);
	}
}
