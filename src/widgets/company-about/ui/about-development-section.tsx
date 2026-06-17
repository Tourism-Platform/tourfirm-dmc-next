import { Layers, Network, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
	AboutDevelopmentPhaseCard,
	AboutGeographySummaryCard,
	CustomSectionHeader
} from "@/shared/ui";

import {
	ABOUT_DEVELOPMENT_PHASES,
	type TAboutDevelopmentPhaseId
} from "../model";

const PHASE_ICONS: Record<TAboutDevelopmentPhaseId, LucideIcon> = {
	phase_1: Rocket,
	phase_2: Layers,
	phase_3: Network
};

export async function AboutDevelopmentSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("development.eyebrow")}
				title={t("development.title")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{ABOUT_DEVELOPMENT_PHASES.map((phase) => {
					const Icon = PHASE_ICONS[phase.id];

					return (
						<AboutDevelopmentPhaseCard
							key={phase.id}
							label={t(phase.i18n.label)}
							icon={Icon}
							description={t(phase.i18n.description)}
						/>
					);
				})}
			</div>

			<AboutGeographySummaryCard
				title={t("development.geography.title")}
				countries={t("development.geography.countries")}
				note={t("development.geography.note")}
			/>
		</section>
	);
}
