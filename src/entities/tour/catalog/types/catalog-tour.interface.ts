import type { ENUM_CATALOG_TOUR_TYPES_TYPE } from "./catalog-tour-type.types";

export interface ICatalogTourCard {
	id: string;
	slug: string | null;
	title: string;
	description: string;
	days: number;
	nights: number;
	priceFrom: number;
	priceTo: number;
	currency: string;
	imageUrl: string;
	route: string[];
	type: ENUM_CATALOG_TOUR_TYPES_TYPE;
	categories: string[];
	languages: string[];
	groupSizeMin: number | null;
	groupSizeMax: number;
	ageFrom: number | null;
	ageTo: number | null;
	optionCount: number | null;
}
