export const ENUM_PREVIEW_TOUR_CATEGORY = {
	CULTURAL_HISTORICAL: "cultural_historical",
	RELIGIOUS_SPIRITUAL: "religious_spiritual",
	ARCHAEOLOGICAL: "archaeological",
	ADVENTURE_OUTDOOR: "adventure_outdoor",
	ECO_NATURE: "eco_nature",
	HIKING_TREKKING: "hiking_trekking",
	CITY_TOUR: "city_tour",
	GASTRONOMY_CULINARY: "gastronomy_culinary",
	PHOTOGRAPHY_CREATIVE: "photography_creative",
	EDUCATIONAL: "educational",
	MASTER_CLASS_WORKSHOP: "master_class_workshop",
	WELLNESS_SPA: "wellness_spa",
	YOGA_MEDITATION: "yoga_meditation",
	BUSINESS_MICE: "business_mice",
	FAMILY_KIDS: "family_kids",
	MULTI_DESTINATION: "multi_destination"
} as const;

export type ENUM_PREVIEW_TOUR_CATEGORY_TYPE =
	(typeof ENUM_PREVIEW_TOUR_CATEGORY)[keyof typeof ENUM_PREVIEW_TOUR_CATEGORY];
