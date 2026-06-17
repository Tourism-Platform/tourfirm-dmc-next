import { Gauge, Link2, type LucideIcon, Route } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader, DestinationInsightCard } from "@/shared/ui";

import { MAIN_WHY_CONFIG, type TMainWhyId } from "../model";

const WHY_ICONS: Record<TMainWhyId, LucideIcon> = {
	programs: Route,
	rhythm: Gauge,
	connection: Link2
};

export async function WhySection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("why.eyebrow")}
				title={t("why.title")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{MAIN_WHY_CONFIG.map((item) => (
					<DestinationInsightCard
						key={item.id}
						data={{
							icon: WHY_ICONS[item.id],
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
}
