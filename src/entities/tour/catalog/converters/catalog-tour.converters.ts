import type { IPaginationResponse } from "@/shared/types";

import { CATALOG_DURATION_PRESETS } from "../config/catalog-duration.config";
import type {
	ICatalogTourBackend,
	ICatalogTourCard,
	ICatalogTourFilters,
	IFilterOption,
	IFilterOptionBackend
} from "../types";
import type { ENUM_CATALOG_DURATION_TYPE } from "../types/catalog-duration.types";
import type {
	IPriceHistogramItem,
	IPriceHistogramItemBackend
} from "../types/price-histogram.interface";

const mapDurationFiltersToQuery = (
	selected: ENUM_CATALOG_DURATION_TYPE[] | undefined
): { durationDaysMin?: number; durationDaysMax?: number } => {
	if (!selected?.length) return {};

	const presets = selected.map((key) => CATALOG_DURATION_PRESETS[key]);

	return {
		durationDaysMin: Math.min(...presets.map((p) => p.from)),
		durationDaysMax: Math.max(...presets.map((p) => p.to))
	};
};

export const mapCatalogTourToFrontend = (
	data: ICatalogTourBackend
): ICatalogTourCard => ({
	id: data.id,
	title: data.title,
	description: data.description,
	duration: data.duration,
	priceFrom: data.price_from,
	priceTo: data.price_to,
	imageUrl: data.image_url,
	rating: data.rating,
	reviewsCount: data.reviews_count,
	hasFreeCancellation: data.has_free_cancellation,
	isRecommended: data.is_recommended
});

export const mapCatalogToursToFrontend = (
	data: ICatalogTourBackend[],
	total?: number
): IPaginationResponse<ICatalogTourCard> => ({
	data: data.map(mapCatalogTourToFrontend),
	total: total ?? data.length
});

export const mapCatalogTourFiltersToQuery = (
	filters: ICatalogTourFilters
): Record<string, string | number> => {
	const params: Record<string, string | number> = {
		page: filters.page,
		limit: filters.limit
	};

	if (filters.search?.trim()) {
		params.search = filters.search.trim();
	}

	if (filters.destination) {
		params.destination = filters.destination;
	}

	if (filters.checkIn) {
		params.checkIn = filters.checkIn;
	}

	if (filters.checkOut) {
		params.checkOut = filters.checkOut;
	}

	const nested = filters.filters;

	if (nested?.region?.length) {
		params.region = nested.region.join(",");
	}

	if (nested?.duration?.length) {
		params.duration = nested.duration.join(",");
	}

	if (nested?.language?.length) {
		params.language = nested.language.join(",");
	}

	if (nested?.category?.length) {
		params.category = nested.category.join(",");
	}

	if (nested?.price) {
		const isDefaultPriceRange =
			nested.price.from === 0 && nested.price.to === 3600;

		if (!isDefaultPriceRange) {
			params.priceFrom = nested.price.from;
			params.priceTo = nested.price.to;
		}
	}

	const durationRange = mapDurationFiltersToQuery(nested?.duration);
	if (durationRange.durationDaysMin !== undefined) {
		params.durationDaysMin = durationRange.durationDaysMin;
	}
	if (durationRange.durationDaysMax !== undefined) {
		params.durationDaysMax = durationRange.durationDaysMax;
	}

	return params;
};

export const mapFilterOptionsPaginatedToFrontend = (
	response: IPaginationResponse<IFilterOptionBackend>
): IPaginationResponse<IFilterOption> => ({
	data: response.data.map(mapFilterOptionToFrontend),
	total: response.total
});

export const mapPriceHistogramToFrontend = (
	data: IPriceHistogramItemBackend[]
): IPriceHistogramItem[] =>
	data.map((item) => ({
		range: item.range,
		count: item.count
	}));

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
