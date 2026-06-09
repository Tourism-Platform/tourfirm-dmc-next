import type { IPaginationResponse } from "@/shared/types";

import type {
	ICatalogTourBackend,
	ICatalogTourCard,
	IFilterOption,
	IFilterOptionBackend
} from "../types";

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
	data: ICatalogTourBackend[]
): IPaginationResponse<ICatalogTourCard> => ({
	data: data.map(mapCatalogTourToFrontend),
	total: data.length
});

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
