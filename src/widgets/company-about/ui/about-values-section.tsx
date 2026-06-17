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

import { CardType, CardsSection } from "@/shared/ui";

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
		<CardsSection
			eyebrow={t("values.eyebrow")}
			title={t("values.title")}
			description={t("values.description")}
			gridClassName="md:grid-cols-2 lg:grid-cols-3"
			cards={ABOUT_VALUES_CONFIG.map((item) => ({
				key: item.id,
				type: CardType.DestinationInsight,
				item: {
					icon: VALUES_ICONS[item.id],
					title: t(item.i18n.title),
					description: t(item.i18n.description)
				}
			}))}
		/>
	);
}
