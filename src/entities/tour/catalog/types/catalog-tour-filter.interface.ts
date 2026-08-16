import type { LanguageCode } from "@/shared/api";

import type { TEnumLanguagesType } from "../../preview-tour";

import type { ENUM_CATALOG_DURATION_TYPE } from "./catalog-duration.types";
import type { ENUM_TOUR_CATEGORY_TYPE } from "./catalog-tour-category.types";

export type ENUM_LANGUAGES_TYPE = TEnumLanguagesType;

export interface ICatalogTourFilters {
	search: string;
	page: number;
	limit: number;
	readLang?: LanguageCode;
	filters?: ICatalogTourFilterValues;
}

interface ICatalogTourFilterValues {
	country?: string[];
	city?: string[];
	duration?: ENUM_CATALOG_DURATION_TYPE[];
	language?: ENUM_LANGUAGES_TYPE[];
	category?: ENUM_TOUR_CATEGORY_TYPE[];
}
