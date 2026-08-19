import type {
	CatalogFiltersSchema,
	LanguageCode,
	LocationSuggestionSchema,
	PublicTourCatalogListResponse,
	TourCatalogSort,
	TourCategory
} from "../Api";
import type { TTourCatalogPublicQuery } from "../types/tour-catalog.types";

export const TOUR_CATALOG_PATHS = {
	suggestLocations: {
		url: "/tour/catalog/suggest",
		method: "GET",
		_types: {} as {
			body: void;
			query: { q: string; lang?: LanguageCode; limit?: number };
			response: LocationSuggestionSchema[];
		}
	} as const,
	listFilters: {
		url: "/tour/catalog/filters",
		method: "GET",
		_types: {} as {
			body: void;
			query: { lang?: LanguageCode };
			response: CatalogFiltersSchema;
		}
	} as const,
	listPublicCatalog: {
		url: "/tour/catalog/public",
		method: "GET",
		_types: {} as {
			body: void;
			query: TTourCatalogPublicQuery;
			response: PublicTourCatalogListResponse;
		}
	} as const,
	listAgencyCatalog: {
		url: "/tour/catalog/agency",
		method: "GET",
		_types: {} as {
			body: void;
			query: {
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
			response: PublicTourCatalogListResponse;
		}
	} as const
} as const;

export const DEFAULT_CATALOG_SECTION_QUERY: TTourCatalogPublicQuery = {
	skip: 0,
	limit: 12
};
