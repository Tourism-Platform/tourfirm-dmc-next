"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import type { ICatalogPreviewOptionCard } from "@/entities/tour/catalog";

import { CatalogTourOptionCard } from "./catalog-tour-option-card";

interface ICatalogTourOptionsCardsProps {
	options: ICatalogPreviewOptionCard[];
}

export const CatalogTourOptionsCardsBase: FC<ICatalogTourOptionsCardsProps> = ({
	options
}) => {
	const t = useTranslations("catalog_tour_page");

	if (!options || options.length === 0) return null;

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="text-2xl font-bold mb-2">
					{t("sections.itinerary.title")}
				</h3>
				<p className="text-sm text-muted-foreground">
					{t("sections.itinerary.subtitle")}
				</p>
			</div>

			<div className="flex flex-col gap-6">
				{options.map((option) => (
					<CatalogTourOptionCard key={option.id} option={option} />
				))}
			</div>
		</div>
	);
};

export const CatalogTourOptionsCards = withErrorBoundary(
	CatalogTourOptionsCardsBase
);
