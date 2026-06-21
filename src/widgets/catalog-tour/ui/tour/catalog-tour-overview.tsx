"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { Previewer, withErrorBoundary } from "@/shared/ui";

import type { ICatalogPreviewTourData } from "@/entities/tour/catalog";

interface ICatalogTourOverviewProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourOverviewBase: FC<ICatalogTourOverviewProps> = ({ data }) => {
	const t = useTranslations("catalog_tour_page");

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{t("sections.overview.title")}
			</h2>
			<Previewer text={data.description} />
		</div>
	);
};

export const CatalogTourOverview = withErrorBoundary(CatalogTourOverviewBase);
