import type { TOUR_CATALOG_PATHS } from "@/shared/api";

export type TCatalogTourBackend =
	(typeof TOUR_CATALOG_PATHS.listPublicCatalog._types.response.data)[number];

export type TListCatalogToursBackendResponse =
	typeof TOUR_CATALOG_PATHS.listPublicCatalog._types.response;

export type TCatalogTourQueryBackend =
	typeof TOUR_CATALOG_PATHS.listPublicCatalog._types.query;

export type TCatalogFiltersBackend =
	typeof TOUR_CATALOG_PATHS.listFilters._types.response;

export type TCatalogFiltersQuery =
	typeof TOUR_CATALOG_PATHS.listFilters._types.query;

export type TSuggestLocationsBackend =
	typeof TOUR_CATALOG_PATHS.suggestLocations._types.response;

export type TSuggestLocationsQuery =
	typeof TOUR_CATALOG_PATHS.suggestLocations._types.query;

export type TLocationSuggestionBackend = TSuggestLocationsBackend[number];
