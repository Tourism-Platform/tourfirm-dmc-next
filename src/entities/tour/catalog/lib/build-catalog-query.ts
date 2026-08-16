import { ENUM_PATH } from "@/shared/config";

import { ENUM_CATALOG_QUERY_PARAM } from "../config/catalog-query.config";
import type { TCatalogUrlQuery } from "../types/catalog-query.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;

const appendArray = (
	searchParams: URLSearchParams,
	key:
		| typeof ENUM_CATALOG_QUERY_PARAM.CITY
		| typeof ENUM_CATALOG_QUERY_PARAM.COUNTRY
		| typeof ENUM_CATALOG_QUERY_PARAM.DURATION
		| typeof ENUM_CATALOG_QUERY_PARAM.CATEGORY
		| typeof ENUM_CATALOG_QUERY_PARAM.LANGUAGE,
	values: string[] | undefined
) => {
	values?.forEach((value) => {
		const trimmed = value.trim();
		if (trimmed) {
			searchParams.append(key, trimmed);
		}
	});
};

export const buildCatalogQueryString = (query: TCatalogUrlQuery): string => {
	const searchParams = new URLSearchParams();

	appendArray(searchParams, ENUM_CATALOG_QUERY_PARAM.CITY, query.city);
	appendArray(searchParams, ENUM_CATALOG_QUERY_PARAM.COUNTRY, query.country);
	appendArray(
		searchParams,
		ENUM_CATALOG_QUERY_PARAM.DURATION,
		query.duration
	);
	appendArray(
		searchParams,
		ENUM_CATALOG_QUERY_PARAM.CATEGORY,
		query.category
	);
	appendArray(
		searchParams,
		ENUM_CATALOG_QUERY_PARAM.LANGUAGE,
		query.language
	);

	if (query.place) {
		searchParams.set(ENUM_CATALOG_QUERY_PARAM.PLACE, query.place);
	}

	if (query.checkIn) {
		searchParams.set(ENUM_CATALOG_QUERY_PARAM.CHECK_IN, query.checkIn);
	}

	if (query.checkOut) {
		searchParams.set(ENUM_CATALOG_QUERY_PARAM.CHECK_OUT, query.checkOut);
	}

	if (query.page && query.page > DEFAULT_PAGE) {
		searchParams.set(ENUM_CATALOG_QUERY_PARAM.PAGE, String(query.page));
	}

	if (query.limit && query.limit !== DEFAULT_LIMIT) {
		searchParams.set(ENUM_CATALOG_QUERY_PARAM.LIMIT, String(query.limit));
	}

	return searchParams.toString();
};

export const buildCatalogRoute = (query?: TCatalogUrlQuery): string => {
	const qs = query ? buildCatalogQueryString(query) : "";

	return qs ? `${ENUM_PATH.TOURS.CATALOG}?${qs}` : ENUM_PATH.TOURS.CATALOG;
};

export const areCatalogQueryStringsEqual = (
	currentSearch: string,
	nextQuery: TCatalogUrlQuery
): boolean => {
	const normalizedCurrent = currentSearch.startsWith("?")
		? currentSearch.slice(1)
		: currentSearch;
	const normalizedNext = buildCatalogQueryString(nextQuery);

	return normalizedCurrent === normalizedNext;
};
