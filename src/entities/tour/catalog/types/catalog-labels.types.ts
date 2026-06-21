export const ENUM_CATALOG_LANGUAGES = {
	ENGLISH: "english",
	RUSSIAN: "russian",
	SPANISH: "spanish",
	ITALIAN: "italian",
	FRENCH: "french",
	CHINESE: "chinese",
	JAPANESE: "japanese",
	UZBEK: "uzbek",
	PORTUGUESE: "portuguese"
} as const;

export type ENUM_CATALOG_LANGUAGES_TYPE =
	(typeof ENUM_CATALOG_LANGUAGES)[keyof typeof ENUM_CATALOG_LANGUAGES];

export const ENUM_CATALOG_AMENITIES = {
	PROFESSIONAL_GUIDE: "professional_guide",
	HOTEL_ACCOMMODATION: "hotel_accommodation",
	BREAKFAST: "breakfast",
	LUNCH: "lunch",
	DINNER: "dinner",
	AIRPORT_TRANSFER: "airport_transfer",
	ENTRANCE_FEES: "entrance_fees",
	TRAVEL_INSURANCE: "travel_insurance",
	TRANSPORTATION: "transportation",
	BOTTLED_WATER: "bottled_water",
	WIFI_ON_BOARD: "wifi_on_board",
	AIR_CONDITIONING: "air_conditioning",
	LUGGAGE_HANDLING: "luggage_handling",
	SUPPORT_24_7: "support_24_7",
	INTERNATIONAL_FLIGHTS: "international_flights",
	VISA_FEES: "visa_fees",
	PERSONAL_EXPENSES: "personal_expenses",
	TIPS_GRATUITIES: "tips_gratuities",
	CAMERA_VIDEO_FEES: "camera_video_fees",
	OPTIONAL_ACTIVITIES: "optional_activities",
	ALCOHOLIC_BEVERAGES: "alcoholic_beverages",
	SOUVENIRS: "souvenirs",
	EXTRA_MEALS: "extra_meals",
	ROOM_SERVICE: "room_service",
	LAUNDRY_SERVICE: "laundry_service",
	PHONE_CALLS: "phone_calls",
	MEDICAL_EXPENSES: "medical_expenses"
} as const;

export type ENUM_CATALOG_AMENITIES_TYPE =
	(typeof ENUM_CATALOG_AMENITIES)[keyof typeof ENUM_CATALOG_AMENITIES];

export const ENUM_CATALOG_PICKUP_TYPE = {
	AIRPORT: "airport",
	HOTEL: "hotel"
} as const;

export type ENUM_CATALOG_PICKUP_TYPE_TYPE =
	(typeof ENUM_CATALOG_PICKUP_TYPE)[keyof typeof ENUM_CATALOG_PICKUP_TYPE];
