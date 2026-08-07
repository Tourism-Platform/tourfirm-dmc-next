import type { TUiPreview } from "@/shared/ui-content/ui-preview.types";

import {
	ENUM_PREVIEW_OPTION_TAB,
	ENUM_PREVIEW_TOUR_TAB,
	type TPreviewOptionTabType,
	type TPreviewTourTabType
} from "../types";

export function getPreviewTourTabLabel(
	texts: TUiPreview["tour"],
	type: TPreviewTourTabType | TPreviewOptionTabType
): string {
	switch (type) {
		case ENUM_PREVIEW_TOUR_TAB.TOUR_INFORMATION:
			return texts.tabs.tourInformation;
		case ENUM_PREVIEW_OPTION_TAB.FULL_ITINERARY:
			return texts.tabs.fullItinerary;
		case ENUM_PREVIEW_OPTION_TAB.PRICING:
			return texts.tabs.pricing;
		default:
			return type;
	}
}

export function getPreviewOptionTabLabel(
	texts: TUiPreview["option"],
	type: TPreviewOptionTabType
): string {
	switch (type) {
		case ENUM_PREVIEW_OPTION_TAB.FULL_ITINERARY:
			return texts.tabs.fullItinerary;
		case ENUM_PREVIEW_OPTION_TAB.PRICING:
			return texts.tabs.pricing;
		default:
			return type;
	}
}
