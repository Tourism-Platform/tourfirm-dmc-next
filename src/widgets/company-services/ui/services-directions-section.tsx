import { getTranslations } from "next-intl/server";

import { CardType, CardsSection } from "@/shared/ui";

import { SERVICES_DIRECTIONS_CONFIG } from "../model";

export async function ServicesDirectionsSection() {
	const t = await getTranslations("company_services_page");

	return (
		<CardsSection
			eyebrow={t("directions.eyebrow")}
			title={t("directions.title")}
			description={t("directions.description")}
			cards={SERVICES_DIRECTIONS_CONFIG.map((item) => ({
				key: item.id,
				type: CardType.ServicesDirection,
				item: {
					imageUrl: item.imageUrl,
					title: t(item.i18n.title),
					description: t(item.i18n.description),
					ctaLabel: t(item.i18n.cta)
				}
			}))}
		/>
	);
}
