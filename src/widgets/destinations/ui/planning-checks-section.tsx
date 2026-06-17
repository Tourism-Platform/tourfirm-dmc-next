import { CalendarDays, type LucideIcon, Route, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader, DestinationInsightCard } from "@/shared/ui";

import { PLANNING_CHECKS_CONFIG, type TPlanningCheckId } from "../model";

const PLANNING_CHECK_ICONS: Record<TPlanningCheckId, LucideIcon> = {
	access: Shield,
	season: CalendarDays,
	movement: Route
};

export async function PlanningChecksSection() {
	const t = await getTranslations("destinations_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("planning_checks.eyebrow")}
				title={t("planning_checks.title")}
				description={t("planning_checks.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{PLANNING_CHECKS_CONFIG.map((item) => (
					<DestinationInsightCard
						key={item.id}
						data={{
							icon: PLANNING_CHECK_ICONS[item.id],
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
}
