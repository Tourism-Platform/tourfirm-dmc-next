import { FullItinerary, Pricing } from "../../ui/option";
import { ENUM_PREVIEW_OPTION_TAB, type TPreviewOptionTab } from "../types";

export const PREVIEW_OPTION_TABS_LIST: TPreviewOptionTab[] = [
	{
		type: ENUM_PREVIEW_OPTION_TAB.FULL_ITINERARY,
		slot: FullItinerary
	},
	{
		type: ENUM_PREVIEW_OPTION_TAB.PRICING,
		slot: Pricing
	}
];
