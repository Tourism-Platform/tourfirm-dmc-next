import { FullItinerary } from "../../ui/option";
import { ENUM_CATALOG_OPTION_TAB, type ICatalogOptionTab } from "../types";

export const CATALOG_OPTION_TABS_LIST: ICatalogOptionTab[] = [
	{
		type: ENUM_CATALOG_OPTION_TAB.FULL_ITINERARY,
		label: "tabs.full_itinerary",
		slot: FullItinerary
	}
	// {
	// 	type: ENUM_CATALOG_OPTION_TAB.PRICING,
	// 	label: "tabs.pricing",
	// 	slot: Pricing
	// }
];
