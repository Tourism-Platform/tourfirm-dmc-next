import { FullItinerary, Pricing } from "../../ui/option";
import { PreviewTourInformationSections } from "../../ui/tour";
import {
	ENUM_PREVIEW_OPTION_TAB,
	ENUM_PREVIEW_TOUR_TAB,
	type TPreviewTourSingleOptionTab
} from "../types";

export const PREVIEW_TOUR_SINGLE_OPTION_TABS: TPreviewTourSingleOptionTab[] = [
	{
		type: ENUM_PREVIEW_TOUR_TAB.TOUR_INFORMATION,
		slot: PreviewTourInformationSections
	},
	{
		type: ENUM_PREVIEW_OPTION_TAB.FULL_ITINERARY,
		slot: FullItinerary
	},
	{
		type: ENUM_PREVIEW_OPTION_TAB.PRICING,
		slot: Pricing
	}
];
