import { Globe2, Layers, Network, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge, CustomSectionHeader } from "@/shared/ui";

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
						<article
							key={phase.id}
							className="bg-card flex flex-col gap-3 rounded-xl border p-5 sm:p-6"
						>
							<Badge
								variant="secondary"
								className="bg-primary/10 text-primary w-fit rounded-full border-transparent"
							>
								{t(phase.i18n.label)}
							</Badge>
							<Icon
								className="text-primary size-5 shrink-0"
								aria-hidden
							/>
							<p className="text-muted-foreground text-sm sm:text-base">
								{t(phase.i18n.description)}
							</p>
						</article>
					);
				})}
			</div>

			<div className="bg-card flex flex-col gap-3 rounded-xl border p-5 sm:gap-4 sm:p-6">
				<div className="flex items-center gap-2">
					<Globe2 className="text-primary size-5 shrink-0" />
					<h3 className="text-base font-semibold sm:text-lg">
						{t("development.geography.title")}
					</h3>
				</div>
				<p className="text-foreground text-sm font-medium sm:text-base">
					{t("development.geography.countries")}
				</p>
				<p className="text-muted-foreground text-sm sm:text-base">
					{t("development.geography.note")}
				</p>
			</div>
		</section>
	);
}
