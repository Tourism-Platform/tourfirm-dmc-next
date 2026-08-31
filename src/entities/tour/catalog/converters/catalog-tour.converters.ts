import { TourCategory } from "@/shared/api";
import type { IPaginationResponse } from "@/shared/types";
import { createEnumMapper } from "@/shared/utils";

import { languageMapper } from "../../preview-tour";
import { CATALOG_DURATION_PRESETS } from "../config";
import {
	type ENUM_CATALOG_DURATION_TYPE,
	ENUM_CATALOG_TOUR_TYPES,
	type ENUM_CATALOG_TOUR_TYPES_TYPE,
	type ENUM_TOUR_CATEGORY_TYPE,
	type ICatalogListFilters,
	type ICatalogTourCard,
	type ICatalogTourFilters,
	type TCatalogFiltersBackend,
	type TCatalogTourBackend,
	type TCatalogTourQueryBackend,
	type TListCatalogToursBackendResponse
} from "../types";

const tourCategoriesMapper = createEnumMapper<
	ENUM_TOUR_CATEGORY_TYPE,
	TourCategory
>({
	cultural_historical: TourCategory.CulturalHistorical,
	religious_spiritual: TourCategory.ReligiousSpiritual,
	archaeological: TourCategory.Archaeological,
	adventure_outdoor: TourCategory.AdventureOutdoor,
	eco_nature: TourCategory.EcoNature,
	hiking_trekking: TourCategory.HikingTrekking,
	city_tour: TourCategory.CityTour,
	gastronomy_culinary: TourCategory.GastronomyCulinary,
	photography_creative: TourCategory.PhotographyCreative,
	educational: TourCategory.Educational,
	master_class_workshop: TourCategory.MasterClassWorkshop,
	wellness_spa: TourCategory.WellnessSpa,
	yoga_meditation: TourCategory.YogaMeditation,
	business_mice: TourCategory.BusinessMice,
	family_kids: TourCategory.FamilyKids,
	multi_destination: TourCategory.MultiDestination
});

const mapTourType = (value: string): ENUM_CATALOG_TOUR_TYPES_TYPE => {
	const normalized = value.toLowerCase();

	if (
		normalized === ENUM_CATALOG_TOUR_TYPES.PRIVATE ||
		normalized.includes("private")
	) {
		return ENUM_CATALOG_TOUR_TYPES.PRIVATE;
	}

	return ENUM_CATALOG_TOUR_TYPES.GROUP;
};

const mapDurationFiltersToQuery = (
	selected: ENUM_CATALOG_DURATION_TYPE[] | undefined
): Pick<
	TCatalogTourQueryBackend,
	"duration_days_min" | "duration_days_max"
> => {
	if (!selected?.length) return {};

	const presets = selected.map((key) => CATALOG_DURATION_PRESETS[key]);

	return {
		duration_days_min: Math.min(...presets.map((p) => p.from)),
		duration_days_max: Math.max(...presets.map((p) => p.to))
	};
};

export const mapCatalogTourToFrontend = (
	data: TCatalogTourBackend
): ICatalogTourCard => {
	const priceSource = data.price_per_person ?? data.price_range;

	return {
		id: data.tour_id,
		slug: data.slug,
		title: data.title ?? "",
		description: data.description ?? "",
		days: data.days,
		nights: data.nights,
		priceFrom: priceSource?.min ?? 0,
		priceTo: priceSource?.max ?? 0,
		currency: priceSource?.currency ?? "USD",
		imageUrl: data.cover_image_url ?? "",
		route: data.cities ?? [],
		type: mapTourType(String(data.tour_type)),
		categories: (data.categories ?? []).map(String),
		languages: [
			...new Set(
				(data.languages ?? []).map((lang) => String(lang).toUpperCase())
			)
		],
		groupSizeMin: data.group_size_min,
		groupSizeMax: data.group_size,
		ageFrom: data.age_from,
		ageTo: data.age_to,
		optionCount: data.option_count ?? null
	};
};

export const mapCatalogTourListToFrontend = (
	data: TCatalogTourBackend[]
): ICatalogTourCard[] => data.map(mapCatalogTourToFrontend);

export const mapCatalogTourPaginatedToFrontend = (
	response: TListCatalogToursBackendResponse
): IPaginationResponse<ICatalogTourCard> => ({
	data: mapCatalogTourListToFrontend(response.data),
	total: response.total_count
});

export const mapCatalogToursToFrontend = (
	response: TListCatalogToursBackendResponse
): IPaginationResponse<ICatalogTourCard> =>
	mapCatalogTourPaginatedToFrontend(response);

export const mapCatalogListFiltersToFrontend = (
	data: TCatalogFiltersBackend
): ICatalogListFilters => ({
	countries: data.countries,
	cities: data.cities
});

export const mapCatalogTourFiltersToPublicCatalogQuery = (
	filters: ICatalogTourFilters
): TCatalogTourQueryBackend => {
	const query: TCatalogTourQueryBackend = {
		...(filters?.page > 1 && { skip: (filters.page - 1) * filters?.limit }),
		...(filters?.limit && { limit: filters.limit }),
		...(!!filters?.filters?.category?.length && {
			categories: tourCategoriesMapper.toMany(filters.filters.category)
		}),
		...(!!filters?.filters?.country?.length && {
			country: filters.filters.country
		}),
		...(!!filters?.filters?.city?.length && {
			city: filters.filters.city
		}),
		...(!!filters?.filters?.language?.length && {
			tour_lang: languageMapper.toMany(filters.filters.language)
		}),
		...(filters?.readLang && { read_lang: filters.readLang }),
		...mapDurationFiltersToQuery(filters?.filters?.duration),
		...(!!filters?.search?.trim().length && { q: filters.search })
	};

	return query;
};
