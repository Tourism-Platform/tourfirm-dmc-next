import {
	ArrowLeftRight,
	Briefcase,
	Globe2,
	Link2,
	Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CardType, CardsSection } from "@/shared/ui";

import { ABOUT_CONNECTION_CONFIG, type TAboutConnectionId } from "../model";

const CONNECTION_ICONS: Record<TAboutConnectionId, LucideIcon> = {
	geography: Globe2,
	experience: Sparkles,
	business: Briefcase,
	access: Link2,
	generations: ArrowLeftRight
};

export async function AboutConnectionSection() {
	const t = await getTranslations("company_about_page");

	return (
		<CardsSection
			eyebrow={t("connection.eyebrow")}
			title={t("connection.title")}
			description={t("connection.description")}
			gridClassName="md:grid-cols-2 lg:grid-cols-3"
			cards={ABOUT_CONNECTION_CONFIG.map((item) => ({
				key: item.id,
				type: CardType.DestinationInsight,
				item: {
					icon: CONNECTION_ICONS[item.id],
					title: t(item.i18n.title),
					description: t(item.i18n.description)
				}
			}))}
		/>
	);
}
