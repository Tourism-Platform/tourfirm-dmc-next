import { Pricing } from "../../ui/option";
import { CatalogTourInformationSections } from "../../ui/tour";
import {
	ENUM_CATALOG_OPTION_TAB,
	ENUM_CATALOG_TOUR_TAB,
	type TCatalogTourSingleOptionTab
} from "../types";

export const CATALOG_TOUR_SINGLE_OPTION_TABS: TCatalogTourSingleOptionTab[] = [
	{
		type: ENUM_CATALOG_TOUR_TAB.TOUR_INFORMATION,
		label: "tabs.tour_information",
		slot: CatalogTourInformationSections
	},
	// {
	// 	type: ENUM_CATALOG_OPTION_TAB.FULL_ITINERARY,
	// 	label: "tabs.full_itinerary",
	// 	slot: FullItinerary
	// },
	{
		type: ENUM_CATALOG_OPTION_TAB.PRICING,
		label: "tabs.pricing",
		slot: Pricing
	}
];
