import type { TOptionsKeys } from "@/shared/i18n/i18n.config";

import {
	ENUM_CATALOG_SEARCH_CATEGORY,
	type ENUM_CATALOG_SEARCH_CATEGORY_TYPE
} from "../types/catalog-search-category.types";

export const CATALOG_SEARCH_CATEGORY_LABELS: Record<
	ENUM_CATALOG_SEARCH_CATEGORY_TYPE,
	TOptionsKeys
> = {
	[ENUM_CATALOG_SEARCH_CATEGORY.CULTURAL_HISTORICAL]:
		"tour.tourCategories.cultural_historical",
	[ENUM_CATALOG_SEARCH_CATEGORY.RELIGIOUS_SPIRITUAL]:
		"tour.tourCategories.religious_spiritual",
	[ENUM_CATALOG_SEARCH_CATEGORY.ARCHAEOLOGICAL]:
		"tour.tourCategories.archaeological",
	[ENUM_CATALOG_SEARCH_CATEGORY.ADVENTURE_OUTDOOR]:
		"tour.tourCategories.adventure_outdoor",
	[ENUM_CATALOG_SEARCH_CATEGORY.ECO_NATURE]: "tour.tourCategories.eco_nature",
	[ENUM_CATALOG_SEARCH_CATEGORY.HIKING_TREKKING]:
		"tour.tourCategories.hiking_trekking",
	[ENUM_CATALOG_SEARCH_CATEGORY.CITY_TOUR]: "tour.tourCategories.city_tour",
	[ENUM_CATALOG_SEARCH_CATEGORY.GASTRONOMY_CULINARY]:
		"tour.tourCategories.gastronomy_culinary",
	[ENUM_CATALOG_SEARCH_CATEGORY.PHOTOGRAPHY_CREATIVE]:
		"tour.tourCategories.photography_creative",
	[ENUM_CATALOG_SEARCH_CATEGORY.EDUCATIONAL]:
		"tour.tourCategories.educational",
	[ENUM_CATALOG_SEARCH_CATEGORY.MASTER_CLASS_WORKSHOP]:
		"tour.tourCategories.master_class_workshop",
	[ENUM_CATALOG_SEARCH_CATEGORY.WELLNESS_SPA]:
		"tour.tourCategories.wellness_spa",
	[ENUM_CATALOG_SEARCH_CATEGORY.YOGA_MEDITATION]:
		"tour.tourCategories.yoga_meditation",
	[ENUM_CATALOG_SEARCH_CATEGORY.BUSINESS_MICE]:
		"tour.tourCategories.business_mice",
	[ENUM_CATALOG_SEARCH_CATEGORY.FAMILY_KIDS]:
		"tour.tourCategories.family_kids",
	[ENUM_CATALOG_SEARCH_CATEGORY.MULTI_DESTINATION]:
		"tour.tourCategories.multi_destination"
};

export const CATALOG_SEARCH_CATEGORY_KEYS = Object.values(
	ENUM_CATALOG_SEARCH_CATEGORY
) as ENUM_CATALOG_SEARCH_CATEGORY_TYPE[];
