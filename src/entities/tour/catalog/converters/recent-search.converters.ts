import type { TDateRange, TSearchTours } from "../schema/search-tours.schema";
import type { IRecentSearch, IRecentSearchBackend } from "../types";

import { mapBackendDatesToDateRange } from "./search-tours.converters";

const mapRecentSearchToSearchTours = (
	destination: string,
	dates: TDateRange
): TSearchTours => ({
	destination,
	dates: dates.from || dates.to ? { ...dates } : undefined
});

export const mapRecentlySearchToFrontend = (
	data: IRecentSearchBackend
): IRecentSearch => {
	const dates = mapBackendDatesToDateRange(data.date_from, data.date_to);

	return {
		id: data.id,
		destination: data.destination,
		label: data.label,
		tourType: data.tour_type,
		dates,
		searchTours: mapRecentSearchToSearchTours(data.destination, dates)
	};
};

export const mapRecentlySearchesToFrontend = (
	data: IRecentSearchBackend[]
): IRecentSearch[] => data.map(mapRecentlySearchToFrontend);
