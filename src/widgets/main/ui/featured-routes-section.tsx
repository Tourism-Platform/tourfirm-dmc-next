"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { RouteIdeaCard } from "@/entities/tour";

import { MAIN_FEATURED_ROUTES_CONFIG } from "../model";

import { MainSectionHeader } from "./main-section-header";

const FeaturedRoutesSectionBase: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<MainSectionHeader
				eyebrow={t("featured_routes.eyebrow")}
				title={t("featured_routes.title")}
				description={t("featured_routes.description")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{MAIN_FEATURED_ROUTES_CONFIG.map((route) => (
					<RouteIdeaCard
						key={route.id}
						data={{
							imageUrl: route.imageUrl,
							imageAlt: t(route.i18n.title),
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
};

export const FeaturedRoutesSection = withErrorBoundary(
	FeaturedRoutesSectionBase
);
