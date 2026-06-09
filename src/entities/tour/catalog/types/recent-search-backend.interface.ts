import type { TTourType } from "./recent-search.interface";

export interface IRecentSearchBackend {
	id: string;
	destination: string;
	label?: string;
	date_from: string;
	date_to: string;
	tour_type?: TTourType;
}
