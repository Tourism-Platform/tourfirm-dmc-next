import type { TOptionsKeys } from "@/shared/i18n/i18n.config";

import {
	ENUM_CATALOG_AMENITIES,
	type ENUM_CATALOG_AMENITIES_TYPE
} from "../types/catalog-labels.types";

export const CATALOG_AMENITIES_INCLUDED_LABELS: Partial<
	Record<ENUM_CATALOG_AMENITIES_TYPE, TOptionsKeys>
> = {
	[ENUM_CATALOG_AMENITIES.PROFESSIONAL_GUIDE]:
		"tour.amenities.professional_guide",
	[ENUM_CATALOG_AMENITIES.HOTEL_ACCOMMODATION]:
		"tour.amenities.hotel_accommodation",
	[ENUM_CATALOG_AMENITIES.BREAKFAST]: "tour.amenities.breakfast",
	[ENUM_CATALOG_AMENITIES.LUNCH]: "tour.amenities.lunch",
	[ENUM_CATALOG_AMENITIES.DINNER]: "tour.amenities.dinner",
	[ENUM_CATALOG_AMENITIES.AIRPORT_TRANSFER]:
		"tour.amenities.airport_transfer",
	[ENUM_CATALOG_AMENITIES.ENTRANCE_FEES]: "tour.amenities.entrance_fees",
	[ENUM_CATALOG_AMENITIES.TRAVEL_INSURANCE]:
		"tour.amenities.travel_insurance",
	[ENUM_CATALOG_AMENITIES.TRANSPORTATION]: "tour.amenities.transportation",
	[ENUM_CATALOG_AMENITIES.BOTTLED_WATER]: "tour.amenities.bottled_water",
	[ENUM_CATALOG_AMENITIES.WIFI_ON_BOARD]: "tour.amenities.wifi_on_board",
	[ENUM_CATALOG_AMENITIES.AIR_CONDITIONING]:
		"tour.amenities.air_conditioning",
	[ENUM_CATALOG_AMENITIES.LUGGAGE_HANDLING]:
		"tour.amenities.luggage_handling",
	[ENUM_CATALOG_AMENITIES.SUPPORT_24_7]: "tour.amenities.support_24_7"
};

export const CATALOG_AMENITIES_NOT_INCLUDED_LABELS: Partial<
	Record<ENUM_CATALOG_AMENITIES_TYPE, TOptionsKeys>
> = {
	[ENUM_CATALOG_AMENITIES.INTERNATIONAL_FLIGHTS]:
		"tour.amenities.international_flights",
	[ENUM_CATALOG_AMENITIES.VISA_FEES]: "tour.amenities.visa_fees",
	[ENUM_CATALOG_AMENITIES.PERSONAL_EXPENSES]:
		"tour.amenities.personal_expenses",
	[ENUM_CATALOG_AMENITIES.TIPS_GRATUITIES]: "tour.amenities.tips_gratuities",
	[ENUM_CATALOG_AMENITIES.CAMERA_VIDEO_FEES]:
		"tour.amenities.camera_video_fees",
	[ENUM_CATALOG_AMENITIES.OPTIONAL_ACTIVITIES]:
		"tour.amenities.optional_activities",
	[ENUM_CATALOG_AMENITIES.TRAVEL_INSURANCE]:
		"tour.amenities.travel_insurance",
	[ENUM_CATALOG_AMENITIES.ALCOHOLIC_BEVERAGES]:
		"tour.amenities.alcoholic_beverages",
	[ENUM_CATALOG_AMENITIES.SOUVENIRS]: "tour.amenities.souvenirs",
	[ENUM_CATALOG_AMENITIES.EXTRA_MEALS]: "tour.amenities.extra_meals",
	[ENUM_CATALOG_AMENITIES.ROOM_SERVICE]: "tour.amenities.room_service",
	[ENUM_CATALOG_AMENITIES.LAUNDRY_SERVICE]: "tour.amenities.laundry_service",
	[ENUM_CATALOG_AMENITIES.PHONE_CALLS]: "tour.amenities.phone_calls",
	[ENUM_CATALOG_AMENITIES.MEDICAL_EXPENSES]: "tour.amenities.medical_expenses"
};
