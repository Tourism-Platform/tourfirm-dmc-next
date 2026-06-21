import type { FC } from "react";

import type {
	TCatalogTourOptionPageKeys,
	TCatalogTourPageKeys
} from "@/shared/i18n/i18n.config";

import type {
	ICatalogPreviewTourData,
	IOptionDetail
} from "@/entities/tour/catalog";

export const ENUM_CATALOG_TOUR_TAB = {
	TOUR_INFORMATION: "tour-information"
} as const;

export const ENUM_CATALOG_OPTION_TAB = {
	FULL_ITINERARY: "full-itinerary",
	PRICING: "pricing"
} as const;

export type TCatalogTourTabType =
	(typeof ENUM_CATALOG_TOUR_TAB)[keyof typeof ENUM_CATALOG_TOUR_TAB];

export type TCatalogOptionTabType =
	(typeof ENUM_CATALOG_OPTION_TAB)[keyof typeof ENUM_CATALOG_OPTION_TAB];

export interface ICatalogOptionTabSlotProps {
	optionData?: IOptionDetail;
}

export interface ICatalogTourInformationSlotProps {
	data?: ICatalogPreviewTourData;
}

export interface ICatalogOptionTab {
	type: TCatalogOptionTabType;
	label: TCatalogTourOptionPageKeys;
	slot: FC<ICatalogOptionTabSlotProps>;
}

export type TCatalogTourSingleOptionTab =
	| {
			type: typeof ENUM_CATALOG_TOUR_TAB.TOUR_INFORMATION;
			label: TCatalogTourPageKeys;
			slot: FC<ICatalogTourInformationSlotProps>;
	  }
	| {
			type: TCatalogOptionTabType;
			label: TCatalogTourPageKeys;
			slot: FC<ICatalogOptionTabSlotProps>;
	  };
