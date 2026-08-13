export type TRouteScope = "COUNTRY" | "CITY" | "ATTRACTION" | "MIXED";

export type TRouteListFilters = {
	theme?: string;
	themeId?: number;
	country?: string;
	scope?: TRouteScope;
	featured?: boolean;
	page?: number;
	limit?: number;
	lean?: boolean;
};

export type TExperienceListFilters = {
	theme?: string;
	themeId?: number;
	type?: string;
	country?: string;
	city?: string;
	featured?: boolean;
	page?: number;
	limit?: number;
	lean?: boolean;
};

export type TTradeFairListFilters = {
	featured?: boolean;
	page?: number;
	limit?: number;
};

export type TBlogListFilters = {
	featured?: boolean;
	page?: number;
	limit?: number;
};

export type TNewsListFilters = {
	featured?: boolean;
	category?: string;
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
