import type { FC } from "react";

import type {
	IOptionDetail,
	IPreviewTourData
} from "@/entities/tour/preview-tour";

export const ENUM_PREVIEW_TOUR_TAB = {
	TOUR_INFORMATION: "tour-information"
} as const;

export const ENUM_PREVIEW_OPTION_TAB = {
	FULL_ITINERARY: "full-itinerary",
	PRICING: "pricing"
} as const;

export type TPreviewTourTabType =
	(typeof ENUM_PREVIEW_TOUR_TAB)[keyof typeof ENUM_PREVIEW_TOUR_TAB];
export type TPreviewOptionTabType =
	(typeof ENUM_PREVIEW_OPTION_TAB)[keyof typeof ENUM_PREVIEW_OPTION_TAB];

export type TPreviewOptionTabSlotProps = { optionData?: IOptionDetail };
export type TPreviewTourInformationSlotProps = { data?: IPreviewTourData };

export type TPreviewOptionTab = {
	type: TPreviewOptionTabType;
	slot: FC<TPreviewOptionTabSlotProps>;
};

export type TPreviewTourSingleOptionTab =
	| {
			type: typeof ENUM_PREVIEW_TOUR_TAB.TOUR_INFORMATION;
			slot: FC<TPreviewTourInformationSlotProps>;
	  }
	| {
			type: TPreviewOptionTabType;
			slot: FC<TPreviewOptionTabSlotProps>;
	  };
