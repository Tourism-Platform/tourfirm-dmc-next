import type { IRecentSearchBackend } from "../types";

export const RECENT_SEARCHES_MOCK: IRecentSearchBackend[] = [
	{
		id: "1",
		destination: "1",
		label: "Uzbekistan",
		date_from: "2026-03-15T00:00:00Z",
		date_to: "2026-03-20T00:00:00Z",
		tour_type: "group"
	},
	{
		id: "2",
		destination: "2",
		label: "Tashkent, Bukhara, Samarkand",
		date_from: "2026-04-10T00:00:00Z",
		date_to: "2026-04-15T00:00:00Z",
		tour_type: "private"
	},
	{
		id: "3",
		destination: "3",
		label: "Samarkand",
		date_from: "2026-05-01T00:00:00Z",
		date_to: "2026-05-10T00:00:00Z",
		tour_type: "group"
	},
	{
		id: "4",
		destination: "4",
		label: "Bukhara",
		date_from: "2026-06-12T00:00:00Z",
		date_to: "2026-06-22T00:00:00Z",
		tour_type: "private"
	}
];
