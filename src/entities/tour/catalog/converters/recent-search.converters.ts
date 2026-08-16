import type { TDateRange, TSearchTours } from "../schema/search-tours.schema";
import type { IRecentSearch, IRecentSearchBackend } from "../types";
import { ENUM_LOCATION_SUGGEST_KIND } from "../types/location-suggest.types";

import { mapBackendDatesToDateRange } from "./search-tours.converters";

const mapRecentSearchToSearchTours = (
	label: string,
	dates: TDateRange
): TSearchTours => ({
	destination: {
		value: label,
		kind: ENUM_LOCATION_SUGGEST_KIND.PLACE,
		label
	},
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
		searchTours: mapRecentSearchToSearchTours(
			data.label ?? data.destination,
			dates
		)
	};
};

export const mapRecentlySearchesToFrontend = (
	data: IRecentSearchBackend[]
): IRecentSearch[] => data.map(mapRecentlySearchToFrontend);
