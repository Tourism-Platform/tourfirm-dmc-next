"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";
import { useValueToTranslateLabel } from "@/shared/utils";

import {
	CATALOG_AMENITIES_INCLUDED_LABELS,
	CATALOG_AMENITIES_NOT_INCLUDED_LABELS,
	type ICatalogPreviewTourData
} from "@/entities/tour/catalog";

interface ICatalogTourAmenitiesProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourAmenitiesBase: FC<ICatalogTourAmenitiesProps> = ({ data }) => {
	const t = useTranslations("catalog_tour_page");

	const allAmenitiesMap = {
		...CATALOG_AMENITIES_NOT_INCLUDED_LABELS,
		...CATALOG_AMENITIES_INCLUDED_LABELS
	};

	const allLabels = useValueToTranslateLabel(allAmenitiesMap);

	const getLabel = (
		value: string,
		labels: { value: string; label: string }[]
	) => labels.find((l) => l.value === value)?.label ?? value;

	if (!data) return null;

	return (
		<div className="grid grid-cols-2 gap-6">
			<div>
				<h3 className="text-xl font-semibold mb-4">
					{t("sections.included.title")}
				</h3>
				<ul className="flex flex-col gap-2">
					{data.included.map((item) => {
						return (
							<li key={item} className="flex items-center gap-2">
								<Check className="text-green-500 w-5 h-5 shrink-0" />
								<span className="text-sm">
									{getLabel(item, allLabels)}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<h3 className="text-xl font-semibold mb-4">
					{t("sections.not_included.title")}
				</h3>
				<ul className="flex flex-col gap-2">
					{data.not_included.map((item) => {
						return (
							<li key={item} className="flex items-center gap-2">
								<X className="text-red-500 w-5 h-5 shrink-0" />
								<span className="text-sm">
									{getLabel(item, allLabels)}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export const CatalogTourAmenities = withErrorBoundary(CatalogTourAmenitiesBase);
