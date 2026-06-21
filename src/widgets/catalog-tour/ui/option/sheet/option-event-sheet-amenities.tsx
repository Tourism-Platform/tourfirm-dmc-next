"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { useValueToTranslateLabel } from "@/shared/utils";

import {
	CATALOG_AMENITIES_INCLUDED_LABELS,
	CATALOG_AMENITIES_NOT_INCLUDED_LABELS,
	type ENUM_CATALOG_AMENITIES_TYPE
} from "@/entities/tour/catalog";

interface IOptionEventSheetAmenitiesProps {
	amenities: ENUM_CATALOG_AMENITIES_TYPE[];
}

export const OptionEventSheetAmenities: FC<IOptionEventSheetAmenitiesProps> = ({
	amenities
}) => {
	const t = useTranslations("catalog_tour_option_page");
	const allLabels = useValueToTranslateLabel({
		...CATALOG_AMENITIES_NOT_INCLUDED_LABELS,
		...CATALOG_AMENITIES_INCLUDED_LABELS
	});

	const getLabel = (value: string) =>
		allLabels.find((item) => item.value === value)?.label ?? value;

	if (!amenities.length) return null;

	return (
		<div>
			<h4 className="font-semibold mb-3">{t("sheet.amenities")}</h4>
			<div className="flex flex-wrap gap-4">
				{amenities.map((amenity) => (
					<div
						key={amenity}
						className="flex items-center gap-2 text-sm"
					>
						<span>{getLabel(amenity)}</span>
					</div>
				))}
			</div>
		</div>
	);
};
