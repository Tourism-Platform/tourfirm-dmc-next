import { Gauge, GitBranch, type LucideIcon, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardType, CardsSection } from "@/shared/ui";

import { HOW_TO_CHOOSE_CONFIG, type THowToChooseId } from "../model";

const HOW_TO_CHOOSE_ICONS: Record<THowToChooseId, LucideIcon> = {
	center: Target,
	expand: GitBranch,
	pace: Gauge
};

export async function HowToChooseSection() {
	const t = await getTranslations("destinations_page");

	return (
		<CardsSection
			eyebrow={t("how_to_choose.eyebrow")}
			title={t("how_to_choose.title")}
			description={t("how_to_choose.description")}
			cards={HOW_TO_CHOOSE_CONFIG.map((item) => ({
				key: item.id,
				type: CardType.DestinationInsight,
				item: {
					icon: HOW_TO_CHOOSE_ICONS[item.id],
					title: t(item.i18n.title),
					description: t(item.i18n.description)
				}
			}))}
		/>
	);
}
