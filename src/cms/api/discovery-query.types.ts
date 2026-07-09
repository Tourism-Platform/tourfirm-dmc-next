export type TRouteScope = "COUNTRY" | "CITY" | "ATTRACTION" | "MIXED";

export type TRouteListFilters = {
	theme?: string;
	country?: string;
	scope?: TRouteScope;
	featured?: boolean;
	page?: number;
	limit?: number;
};

export type TExperienceListFilters = {
	theme?: string;
	type?: string;
	country?: string;
	city?: string;
	featured?: boolean;
	page?: number;
	limit?: number;
};

export type TDiscoveryListResult<TDoc> = {
	docs: TDoc[];
	totalDocs: number;
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export const DISCOVERY_LIST_DEFAULT_LIMIT = 12;
