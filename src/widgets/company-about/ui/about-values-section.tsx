import {
	Compass,
	Eye,
	Handshake,
	Heart,
	ShieldCheck,
	Timer,
	Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { ABOUT_VALUES_CONFIG, type TAboutValuesId } from "../model";

const VALUES_ICONS: Record<TAboutValuesId, LucideIcon> = {
	expertise: Compass,
	reliability: ShieldCheck,
	transparency: Eye,
	speed: Timer,
	passion: Heart,
	respect: Zap,
	partnership: Handshake
};

export async function AboutValuesSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("values.eyebrow")}
				title={t("values.title")}
				description={t("values.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{ABOUT_VALUES_CONFIG.map((item) => (
					<CardRender
						key={item.id}
						variant={CardVariant.DestinationInsight}
						item={{
							icon: VALUES_ICONS[item.id],
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
}
