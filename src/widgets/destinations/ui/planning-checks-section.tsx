import { CalendarDays, type LucideIcon, Route, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardType, CardsSection } from "@/shared/ui";

import { PLANNING_CHECKS_CONFIG, type TPlanningCheckId } from "../model";

const PLANNING_CHECK_ICONS: Record<TPlanningCheckId, LucideIcon> = {
	access: Shield,
	season: CalendarDays,
	movement: Route
};

export async function PlanningChecksSection() {
	const t = await getTranslations("destinations_page");

	return (
		<CardsSection
			eyebrow={t("planning_checks.eyebrow")}
			title={t("planning_checks.title")}
			description={t("planning_checks.description")}
			cards={PLANNING_CHECKS_CONFIG.map((item) => ({
				key: item.id,
				type: CardType.DestinationInsight,
				item: {
					icon: PLANNING_CHECK_ICONS[item.id],
					title: t(item.i18n.title),
					description: t(item.i18n.description)
				}
			}))}
		/>
	);
}
