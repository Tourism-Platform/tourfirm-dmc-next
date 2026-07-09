import { getLucideIcon } from "@/shared/lib/get-lucide-icon";

import { CardType, type TCardRenderProps } from "../types/card-render.types";

import { CountryCard } from "./country-card";
import { DestinationInsightCard } from "./destination-insight-card";
import { ExperienceCard } from "./experience-card";
import { JournalCard } from "./journal-card";
import { OverviewStatCard } from "./overview-stat-card";
import { RouteIdeaCard } from "./route-idea-card";
import { ServicesBusinessCard } from "./services-business-card";
import { ServicesDirectionCard } from "./services-direction-card";
import { ServicesProcessCard } from "./services-process-card";
import { TeamMemberCard } from "./team-member-card";
import { TradeFairCard } from "./trade-fair-card";
import { TripFormatCard } from "./trip-format-card";

export function CardRender({ type: variant, item }: TCardRenderProps) {
	const icon = getLucideIcon(item.icon);
	switch (variant) {
		case CardType.Country:
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
		case CardType.DestinationInsight:
			return (
				<DestinationInsightCard
					data={{
						icon,
						title: item.title ?? "",
						description: item.description ?? ""
					}}
				/>
			);
		case CardType.TeamMember:
			return (
				<TeamMemberCard
					data={{
						icon,
						title: item.title ?? "",
						description: item.description ?? "",
						href: item.href ?? ""
					}}
				/>
			);
		case CardType.RouteIdea:
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
		case CardType.Experience:
			return (
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
			);
		case CardType.TradeFair:
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
		case CardType.Journal:
			return (
				<JournalCard
					data={{
						imageUrl: item.imageUrl ?? "",
						meta: item.meta ?? "",
						title: item.title ?? ""
					}}
				/>
			);
		case CardType.OverviewStat:
			return <OverviewStatCard icon={icon} value={item.value ?? ""} />;
		case CardType.ServicesBusiness:
			return (
				<ServicesBusinessCard
					badge={item.badge ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
					icon={icon}
					className={item.className}
				/>
			);
		case CardType.ServicesDirection:
			return (
				<ServicesDirectionCard
					imageUrl={item.imageUrl ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
					ctaLabel={item.ctaLabel ?? ""}
				/>
			);
		case CardType.ServicesProcess:
			return (
				<ServicesProcessCard
					step={item.step ?? ""}
					title={item.title ?? ""}
					description={item.description ?? ""}
				/>
			);
		case CardType.TripFormat:
			return (
				<TripFormatCard
					data={{
						id: "",
						badge: item.badge ?? "",
						icon,
						title: item.title ?? "",
						description: item.description ?? ""
					}}
				/>
			);
	}
}
