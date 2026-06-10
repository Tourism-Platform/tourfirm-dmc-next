import {
	Award,
	Languages,
	Leaf,
	type LucideIcon,
	Map,
	ShieldCheck,
	SlidersHorizontal
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DestinationInsightCard } from "@/entities/tour";

import { ABOUT_WHY_CONFIG, type TAboutWhyId } from "../model";

import { AboutSectionHeader } from "./about-section-header";

const WHY_ICONS: Record<TAboutWhyId, LucideIcon> = {
	experience: Award,
	languages: Languages,
	individual: SlidersHorizontal,
	routes: Map,
	quality: ShieldCheck,
	sustainability: Leaf
};

export async function AboutWhySection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<AboutSectionHeader
				eyebrow={t("why.eyebrow")}
				title={t("why.title")}
				description={t("why.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{ABOUT_WHY_CONFIG.map((item) => (
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
