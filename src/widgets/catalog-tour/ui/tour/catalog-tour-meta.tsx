"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";
import { useValueToTranslateLabel } from "@/shared/utils";

import {
	CATALOG_LANGUAGES_LABELS,
	type ICatalogPreviewTourData
} from "@/entities/tour/catalog";

import { META_INFO } from "../../model/config";

interface ICatalogTourMetaProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourMetaBase: FC<ICatalogTourMetaProps> = ({ data }) => {
	const t = useTranslations("catalog_tour_page");
	const languagesLabels = useValueToTranslateLabel(CATALOG_LANGUAGES_LABELS);

	if (!data) return null;

	const getLabel = (
		value: string,
		labels: { value: string; label: string }[]
	) => labels.find((l) => l.value === value)?.label ?? value;

	const citiesStr = data.cities?.join(", ") || "";
	const languagesStr =
		data.languages?.map((l) => getLabel(l, languagesLabels)).join(", ") ||
		"";

	const metaData = META_INFO(
		citiesStr,
		languagesStr,
		t("sections.cities.label"),
		t("sections.languages.label")
	);

	if (metaData.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm">
			{metaData.map((item, idx) => (
				<div key={idx} className="flex items-center gap-2">
					<item.icon className="w-5 h-5 text-muted-foreground shrink-0" />
					<span className="font-medium">{item.label}:</span>
					<span className="text-muted-foreground">{item.value}</span>
				</div>
			))}
		</div>
	);
};

export const CatalogTourMeta = withErrorBoundary(CatalogTourMetaBase);
