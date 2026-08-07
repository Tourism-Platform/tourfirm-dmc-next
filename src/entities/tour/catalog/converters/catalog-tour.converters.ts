import type { IPaginationResponse } from "@/shared/types";

import {
	ENUM_CATALOG_TOUR_TYPES,
	type ENUM_CATALOG_TOUR_TYPES_TYPE,
	type ICatalogTourCard,
	type IFilterOption,
	type IFilterOptionBackend,
	type TCatalogTourBackend,
	type TListCatalogToursBackendResponse
} from "../types";

const mapTourType = (value: string): ENUM_CATALOG_TOUR_TYPES_TYPE => {
	const normalized = value.toLowerCase();

	if (
		normalized === ENUM_CATALOG_TOUR_TYPES.PRIVATE ||
		normalized.includes("private")
	) {
		return ENUM_CATALOG_TOUR_TYPES.PRIVATE;
	}

	return ENUM_CATALOG_TOUR_TYPES.GROUP;
};

export const mapCatalogTourToFrontend = (
	data: TCatalogTourBackend
): ICatalogTourCard => {
	const priceSource = data.price_per_person ?? data.price_range;

	return {
		id: data.tour_id,
		title: data.name,
		description: data.description ?? "",
		days: data.days,
		nights: data.nights,
		priceFrom: priceSource?.min ?? 0,
		priceTo: priceSource?.max ?? 0,
		currency: priceSource?.currency ?? "USD",
		imageUrl: data.cover_image_url ?? "",
		route: data.cities ?? [],
		type: mapTourType(String(data.tour_type)),
		categories: (data.categories ?? []).map(String),
		languages: [
			...new Set(
				(data.languages ?? []).map((lang) => String(lang).toUpperCase())
			)
		],
		groupSizeMin: data.group_size_min,
		groupSizeMax: data.group_size,
		ageFrom: data.age_from,
		ageTo: data.age_to,
		optionCount: data.option_count ?? null
	};
};

export const mapCatalogTourPaginatedToFrontend = (
	response: TListCatalogToursBackendResponse
): IPaginationResponse<ICatalogTourCard> => ({
	data: response.map(mapCatalogTourToFrontend),
	total: response.length
});

export const mapCatalogToursToFrontend = mapCatalogTourPaginatedToFrontend;

export const mapFilterOptionToFrontend = (
	data: IFilterOptionBackend
): IFilterOption => ({
	id: data.id,
	title: data.title,
	value: data.value
});

export const mapFilterOptionsToFrontend = (
	data: IFilterOptionBackend[]
): IFilterOption[] => data.map(mapFilterOptionToFrontend);
