import type { DateRange } from "react-day-picker";

import type { TSearchTours } from "../schema";

export type TTourType = "group" | "private";

export interface IRecentSearch {
	id: string;
	destination: string;
	label?: string;
	tourType?: TTourType;
	dates: DateRange;
	searchTours: TSearchTours;
}
