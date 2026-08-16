import type { TLocationSuggestion } from "./location-suggest.types";

export type TCatalogLocationQuery = {
	city?: string[];
	country?: string[];
	place?: string;
};

export type TCatalogUrlQuery = TCatalogLocationQuery & {
	checkIn?: string;
	checkOut?: string;
	page?: number;
	limit?: number;
	duration?: string[];
	category?: string[];
	language?: string[];
};

export type TCatalogLocationBar = {
	destination: TLocationSuggestion | null;
	dates?: {
		from: Date | undefined;
		to?: Date | undefined;
	};
};
