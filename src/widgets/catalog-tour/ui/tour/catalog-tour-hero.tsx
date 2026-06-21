"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import type { ICatalogPreviewTourGeneral } from "@/entities/tour/catalog";

import { HERO_INFO } from "../../model";

interface ICatalogTourHeroProps {
	tour?: ICatalogPreviewTourGeneral;
}

const CatalogTourHeroBase: FC<ICatalogTourHeroProps> = ({ tour }) => {
	const t = useTranslations("catalog_tour_page");

	if (!tour) return null;

	const heroData = HERO_INFO(tour, t);

	return (
		<div className="flex flex-col gap-4 self-center pt-16">
			<h1 className="text-3xl font-bold">{tour.tourTitle}</h1>
			<div className="flex items-center gap-6 text-sm text-muted-foreground">
				{heroData.map((item, idx) => (
					<span key={idx} className="flex items-center gap-1.5">
						<item.icon className="w-4 h-4" />
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
};

export const CatalogTourHero = withErrorBoundary(CatalogTourHeroBase);
