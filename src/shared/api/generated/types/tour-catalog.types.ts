import type {
	CatalogFiltersSchema,
	LanguageCode,
	LocationSuggestionSchema,
	PublicTourCatalogListResponse,
	PublicTourCatalogSchemaOutput,
	TourCatalogSort,
	TourCategory
} from "../Api";

export type TTourCatalogSort = TourCatalogSort;
export type TTourCategory = TourCategory;
export type TLanguageCode = LanguageCode;
export type TPublicTourCatalogSchema = PublicTourCatalogSchemaOutput;
export type TCatalogFiltersSchema = CatalogFiltersSchema;
export type TPublicTourCatalogListResponse = PublicTourCatalogListResponse;
export type TLocationSuggestionSchema = LocationSuggestionSchema;

export type TTourCatalogPublicQuery = {
	sort?: TourCatalogSort | null;
	q?: string | null;
	categories?: TourCategory[] | null;
	duration_days_min?: number | null;
	duration_days_max?: number | null;
	city?: string[] | null;
	country?: string[] | null;
	tour_lang?: LanguageCode[] | null;
	read_lang?: LanguageCode;
	skip?: number;
	limit?: number;
};

export type TTourCatalogFiltersQuery = {
	read_lang?: LanguageCode;
};

export type TTourCatalogSuggestQuery = {
	q: string;
	read_lang?: LanguageCode;
	limit?: number;
};
