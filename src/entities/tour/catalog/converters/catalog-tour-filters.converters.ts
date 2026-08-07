import type { IPaginationResponse } from "@/shared/types";

import type {
	IFilterOption,
	IFilterOptionBackend,
	IPriceHistogramItem,
	IPriceHistogramItemBackend
} from "../types";

export const mapCatalogFilterPaginatedToFrontend = (
	response: IPaginationResponse<IFilterOptionBackend>
): IPaginationResponse<IFilterOption> => ({
	data: response.data.map((item) => ({
		id: item.id,
		title: item.title,
		value: item.value
	})),
	total: response.total
});

export const mapPriceHistogramToFrontend = (
	response: IPriceHistogramItemBackend[]
): IPriceHistogramItem[] =>
	response.map((item) => ({
		range: item.range,
		count: item.count
	}));
