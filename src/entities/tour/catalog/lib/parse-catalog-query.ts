import {
	CATALOG_QUERY_ARRAY_PARAMS,
	ENUM_CATALOG_QUERY_PARAM
} from "../config/catalog-query.config";
import type { TCatalogUrlQuery } from "../types/catalog-query.types";

const parsePositiveInt = (value: string | null): number | undefined => {
	if (!value) return undefined;

	const parsed = Number.parseInt(value, 10);

	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const parseCatalogQuery = (
	search: string | URLSearchParams
): TCatalogUrlQuery => {
	const params =
		typeof search === "string" ? new URLSearchParams(search) : search;

	const query: TCatalogUrlQuery = {};

	const place = params.get(ENUM_CATALOG_QUERY_PARAM.PLACE);
	if (place) {
		query.place = place;
	}

	const checkIn = params.get(ENUM_CATALOG_QUERY_PARAM.CHECK_IN);
	if (checkIn) {
		query.checkIn = checkIn;
	}

	const checkOut = params.get(ENUM_CATALOG_QUERY_PARAM.CHECK_OUT);
	if (checkOut) {
		query.checkOut = checkOut;
	}

	const page = parsePositiveInt(params.get(ENUM_CATALOG_QUERY_PARAM.PAGE));
	if (page) {
		query.page = page;
	}

	const limit = parsePositiveInt(params.get(ENUM_CATALOG_QUERY_PARAM.LIMIT));
	if (limit) {
		query.limit = limit;
	}

	for (const key of CATALOG_QUERY_ARRAY_PARAMS) {
		const values = params
			.getAll(key)
			.map((value) => value.trim())
			.filter(Boolean);

		if (values.length > 0) {
			query[key] = values;
		}
	}

	return query;
};
