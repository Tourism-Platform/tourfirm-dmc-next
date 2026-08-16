import type { ICatalogTourFilters } from "@/entities/tour";

export const DEFAULT_CATALOG_FILTERS: ICatalogTourFilters = {
	search: "",
	page: 1,
	limit: 9,
	filters: {
		country: [],
		city: [],
		duration: [],
		language: [],
		category: []
	}
};

export type TCatalogViewMode = "grid" | "list";
