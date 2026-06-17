import { getTranslations } from "next-intl/server";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { MAIN_FEATURED_ROUTES_CONFIG } from "../model";

export async function FeaturedRoutesSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("featured_routes.eyebrow")}
				title={t("featured_routes.title")}
				description={t("featured_routes.description")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{MAIN_FEATURED_ROUTES_CONFIG.map((route) => (
					<CardRender
						key={route.id}
						variant={CardVariant.RouteIdea}
						item={{
							imageUrl: route.imageUrl,
							badge: t(route.i18n.badge),
							meta: t(route.i18n.meta),
							title: t(route.i18n.title),
							description: t(route.i18n.description),
							ctaHref: route.ctaHref,
							ctaLabel: t("featured_routes.cta")
						}}
					/>
				))}
			</div>
		</section>
	);
}
