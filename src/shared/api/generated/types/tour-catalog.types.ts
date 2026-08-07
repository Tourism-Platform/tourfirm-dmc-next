export type TTourCatalogSort =
	| "price_asc"
	| "price_desc"
	| "duration_asc"
	| "duration_desc";

export type TTourCategory = string;
export type TTourType = "group" | "private" | string;
export type TLanguageCode = string;

export type TPriceRangeSchema = {
	min: number;
	max: number;
	currency: string;
};

export type TPublicTourCatalogSchema = {
	tour_id: string;
	name: string;
	cover_image_url: string | null;
	description: string | null;
	days: number;
	nights: number;
	duration_hours: number | null;
	age_from: number | null;
	age_to: number | null;
	group_size: number;
	group_size_min: number | null;
	categories: TTourCategory[];
	tour_type: TTourType;
	landing_photos: string[];
	cities: string[];
	languages: TLanguageCode[];
	price_range: TPriceRangeSchema | null;
	price_per_person: TPriceRangeSchema | null;
	option_count?: number | null;
};

export type TTourCatalogPublicQuery = {
	sort?: TTourCatalogSort | null;
	q?: string | null;
	categories?: TTourCategory[] | null;
	duration_days_min?: number | null;
	duration_days_max?: number | null;
	city?: string | null;
	country?: string | null;
	language?: TLanguageCode | null;
	skip?: number;
	limit?: number;
};
