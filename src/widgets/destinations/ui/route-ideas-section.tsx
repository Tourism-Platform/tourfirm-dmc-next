import { getTranslations } from "next-intl/server";

import { CardType, CardsSection } from "@/shared/ui";

import { ROUTE_IDEAS_CONFIG } from "../model";

export async function RouteIdeasSection() {
	const t = await getTranslations("destinations_page");

	return (
		<CardsSection
			eyebrow={t("route_ideas.eyebrow")}
			title={t("route_ideas.title")}
			description={t("route_ideas.description")}
			cards={ROUTE_IDEAS_CONFIG.map((idea) => ({
				key: idea.id,
				type: CardType.RouteIdea,
				item: {
					imageUrl: idea.imageUrl,
					badge: t(idea.i18n.badge),
					meta: t(idea.i18n.meta),
					title: t(idea.i18n.title),
					description: t(idea.i18n.description),
					ctaHref: idea.ctaHref,
					ctaLabel: t("route_ideas.cta")
				}
			}))}
		/>
	);
}
