import type {
	TPublicTourCatalogSchema,
	TTourCatalogPublicQuery
} from "../types/tour-catalog.types";

export const TOUR_CATALOG_PATHS = {
	listPublicCatalog: {
		url: "/tour/catalog/public",
		method: "GET",
		_types: {} as {
			body: void;
			query: TTourCatalogPublicQuery;
			response: TPublicTourCatalogSchema[];
		}
	},
	listAgencyCatalog: {
		url: "/tour/catalog/agency",
		method: "GET",
		_types: {} as {
			body: void;
			query: TTourCatalogPublicQuery;
			response: TPublicTourCatalogSchema[];
		}
	}
} as const;

export const DEFAULT_CATALOG_SECTION_QUERY: TTourCatalogPublicQuery = {
	skip: 0,
	limit: 12
};
