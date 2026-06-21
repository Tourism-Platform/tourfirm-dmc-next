"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { Previewer, withErrorBoundary } from "@/shared/ui";

import type { ICatalogPreviewTourData } from "@/entities/tour/catalog";

interface ICatalogTourCancellationProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourCancellationBase: FC<ICatalogTourCancellationProps> = ({
	data
}) => {
	const t = useTranslations("catalog_tour_page");

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{t("sections.cancellation.title")}
			</h2>
			<Previewer text={data.cancellation_policy} />
		</div>
	);
};

export const CatalogTourCancellation = withErrorBoundary(
	CatalogTourCancellationBase
);
