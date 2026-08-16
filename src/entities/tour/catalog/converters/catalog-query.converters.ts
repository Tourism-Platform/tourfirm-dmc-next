import { formatDateToISO, fromatISOtoDate } from "@/shared/utils";

import type { ENUM_CATALOG_DURATION_TYPE } from "../types/catalog-duration.types";
import type {
	TCatalogLocationBar,
	TCatalogUrlQuery
} from "../types/catalog-query.types";
import type { ENUM_TOUR_CATEGORY_TYPE } from "../types/catalog-tour-category.types";
import type {
	ENUM_LANGUAGES_TYPE,
	ICatalogTourFilters
} from "../types/catalog-tour-filter.interface";
import { ENUM_LOCATION_SUGGEST_KIND } from "../types/location-suggest.types";

const isCatalogDuration = (
	value: string
): value is ENUM_CATALOG_DURATION_TYPE =>
	["half_day", "full_day", "multi_days"].includes(value);

export const mapCatalogQueryToLocationBar = (
	query: TCatalogUrlQuery
): TCatalogLocationBar => {
	const from = query.checkIn ? fromatISOtoDate(query.checkIn) : undefined;
	const to = query.checkOut ? fromatISOtoDate(query.checkOut) : undefined;

	const city = query.city?.[0];
	const country = query.country?.[0];

	let destination: TCatalogLocationBar["destination"] = null;

	if (city) {
		destination = {
			value: city,
			kind: ENUM_LOCATION_SUGGEST_KIND.CITY,
			label: city
		};
	} else if (country) {
		destination = {
			value: country,
			kind: ENUM_LOCATION_SUGGEST_KIND.COUNTRY,
			label: country
		};
	} else if (query.place) {
		destination = {
			value: query.place,
			kind: ENUM_LOCATION_SUGGEST_KIND.PLACE,
			label: query.place
		};
	}

	return {
		destination,
		dates: from || to ? { from, to } : undefined
	};
};

export const mapLocationBarToCatalogQuery = (
	data: TCatalogLocationBar
): TCatalogUrlQuery => {
	const query: TCatalogUrlQuery = {
		...(data.dates?.from && {
			checkIn: formatDateToISO(data.dates.from)
		}),
		...(data.dates?.to && {
			checkOut: formatDateToISO(data.dates.to)
		})
	};

	const destination = data.destination;

	if (!destination) {
		return query;
	}

	switch (destination.kind) {
		case ENUM_LOCATION_SUGGEST_KIND.CITY:
			query.city = [destination.value];
			break;
		case ENUM_LOCATION_SUGGEST_KIND.COUNTRY:
			query.country = [destination.value];
			break;
		case ENUM_LOCATION_SUGGEST_KIND.PLACE:
			query.place = destination.value;
			break;
	}

	return query;
};

export const mapCatalogQueryToCatalogFilters = (
	query: TCatalogUrlQuery,
	defaults: ICatalogTourFilters
): ICatalogTourFilters => ({
	...defaults,
	search: query.place ?? "",
	page: query.page ?? defaults.page,
	limit: query.limit ?? defaults.limit,
	filters: {
		country: query.country ?? [],
		city: query.city ?? [],
		duration: (query.duration ?? []).filter(isCatalogDuration),
		language: (query.language ?? []) as ENUM_LANGUAGES_TYPE[],
		category: (query.category ?? []) as ENUM_TOUR_CATEGORY_TYPE[]
	}
});

export const mapCatalogFiltersToCatalogQuery = (
	filters: ICatalogTourFilters
): TCatalogUrlQuery => {
	const query: TCatalogUrlQuery = {
		page: filters.page,
		limit: filters.limit,
		duration: filters.filters?.duration,
		category: filters.filters?.category,
		language: filters.filters?.language,
		city: filters.filters?.city?.length ? filters.filters.city : undefined,
		country: filters.filters?.country?.length
			? filters.filters.country
			: undefined
	};

	const search = filters.search?.trim();
	if (search) {
		query.place = search;
	}

	return query;
};

export const mergeCatalogQuery = (
	base: TCatalogUrlQuery,
	override: TCatalogUrlQuery
): TCatalogUrlQuery => ({ ...base, ...override });
