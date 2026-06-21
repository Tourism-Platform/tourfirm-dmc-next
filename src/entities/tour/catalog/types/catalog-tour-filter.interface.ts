import type { ENUM_CATALOG_DURATION_TYPE } from "./catalog-duration.types";
import type { ENUM_CATALOG_LANGUAGES_TYPE } from "./catalog-labels.types";
import type { ENUM_CATALOG_SEARCH_CATEGORY_TYPE } from "./catalog-search-category.types";

export interface ICatalogTourFilters {
	search?: string;
	page: number;
	limit: number;
	destination?: string;
	checkIn?: string;
	checkOut?: string;
	filters?: {
		region?: string[];
		duration?: ENUM_CATALOG_DURATION_TYPE[];
		language?: ENUM_CATALOG_LANGUAGES_TYPE[];
		category?: ENUM_CATALOG_SEARCH_CATEGORY_TYPE[];
		price?: {
			from: number;
			to: number;
		};
	};
}
