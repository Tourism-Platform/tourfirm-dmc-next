"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { RouteIdeaCard } from "@/entities/tour";

import { ROUTE_IDEAS_CONFIG } from "../model";

import { DestinationsSectionHeader } from "./destinations-section-header";

export const RouteIdeasSection: FC = () => {
	const t = useTranslations("destinations_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<DestinationsSectionHeader
				eyebrow={t("route_ideas.eyebrow")}
				title={t("route_ideas.title")}
				description={t("route_ideas.description")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{ROUTE_IDEAS_CONFIG.map((idea) => (
					<RouteIdeaCard
						key={idea.id}
						data={{
							imageUrl: idea.imageUrl,
							imageAlt: t(idea.i18n.title),
							badge: t(idea.i18n.badge),
							meta: t(idea.i18n.meta),
							title: t(idea.i18n.title),
							description: t(idea.i18n.description),
							ctaHref: idea.ctaHref,
							ctaLabel: t("route_ideas.cta")
						}}
					/>
				))}
			</div>
		</section>
	);
};
