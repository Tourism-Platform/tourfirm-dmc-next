import type { TAppLocale } from "../../lib/app-locale";
import type { ICatalogTourBackend } from "../../types";

import { CATALOG_REGIONS_MOCK as CATALOG_REGIONS_MOCK_EN } from "./locales/en/catalog-regions.generated";
import { CATALOG_TOURS_MOCK as CATALOG_TOURS_MOCK_EN } from "./locales/en/catalog-tours.generated";
import { POPULAR_TOURS_MOCK as POPULAR_TOURS_MOCK_EN } from "./locales/en/popular-tours.generated";
import { PRICE_HISTOGRAM_MOCK as PRICE_HISTOGRAM_MOCK_EN } from "./locales/en/price-histogram.generated";
import { SPECIAL_OFFERS_MOCK as SPECIAL_OFFERS_MOCK_EN } from "./locales/en/special-offers.generated";
import { TOUR_PACKAGE_MOCKS as TOUR_PACKAGE_MOCKS_EN } from "./locales/en/tour-packages.generated";
import { CATALOG_REGIONS_MOCK as CATALOG_REGIONS_MOCK_RU } from "./locales/ru/catalog-regions.generated";
import { CATALOG_TOURS_MOCK as CATALOG_TOURS_MOCK_RU } from "./locales/ru/catalog-tours.generated";
import { POPULAR_TOURS_MOCK as POPULAR_TOURS_MOCK_RU } from "./locales/ru/popular-tours.generated";
import { PRICE_HISTOGRAM_MOCK as PRICE_HISTOGRAM_MOCK_RU } from "./locales/ru/price-histogram.generated";
import { SPECIAL_OFFERS_MOCK as SPECIAL_OFFERS_MOCK_RU } from "./locales/ru/special-offers.generated";
import { TOUR_PACKAGE_MOCKS as TOUR_PACKAGE_MOCKS_RU } from "./locales/ru/tour-packages.generated";
import { CATALOG_REGIONS_MOCK as CATALOG_REGIONS_MOCK_UZ } from "./locales/uz/catalog-regions.generated";
import { CATALOG_TOURS_MOCK as CATALOG_TOURS_MOCK_UZ } from "./locales/uz/catalog-tours.generated";
import { POPULAR_TOURS_MOCK as POPULAR_TOURS_MOCK_UZ } from "./locales/uz/popular-tours.generated";
import { PRICE_HISTOGRAM_MOCK as PRICE_HISTOGRAM_MOCK_UZ } from "./locales/uz/price-histogram.generated";
import { SPECIAL_OFFERS_MOCK as SPECIAL_OFFERS_MOCK_UZ } from "./locales/uz/special-offers.generated";
import { TOUR_PACKAGE_MOCKS as TOUR_PACKAGE_MOCKS_UZ } from "./locales/uz/tour-packages.generated";
import type { ITourPackageMockBundle } from "./tour-packages.types";

export interface ICatalogLocaleMocks {
	tourPackages: Record<string, ITourPackageMockBundle>;
	catalogTours: ICatalogTourBackend[];
	popularTours: ICatalogTourBackend[];
	specialOffers: ICatalogTourBackend[];
	catalogRegions: typeof CATALOG_REGIONS_MOCK_EN;
	priceHistogram: typeof PRICE_HISTOGRAM_MOCK_EN;
}

const MOCKS_BY_LOCALE: Record<TAppLocale, ICatalogLocaleMocks> = {
	en: {
		tourPackages: TOUR_PACKAGE_MOCKS_EN,
		catalogTours: CATALOG_TOURS_MOCK_EN,
		popularTours: POPULAR_TOURS_MOCK_EN,
		specialOffers: SPECIAL_OFFERS_MOCK_EN,
		catalogRegions: CATALOG_REGIONS_MOCK_EN,
		priceHistogram: PRICE_HISTOGRAM_MOCK_EN
	},
	ru: {
		tourPackages: TOUR_PACKAGE_MOCKS_RU,
		catalogTours: CATALOG_TOURS_MOCK_RU,
		popularTours: POPULAR_TOURS_MOCK_RU,
		specialOffers: SPECIAL_OFFERS_MOCK_RU,
		catalogRegions: CATALOG_REGIONS_MOCK_RU,
		priceHistogram: PRICE_HISTOGRAM_MOCK_RU
	},
	uz: {
		tourPackages: TOUR_PACKAGE_MOCKS_UZ,
		catalogTours: CATALOG_TOURS_MOCK_UZ,
		popularTours: POPULAR_TOURS_MOCK_UZ,
		specialOffers: SPECIAL_OFFERS_MOCK_UZ,
		catalogRegions: CATALOG_REGIONS_MOCK_UZ,
		priceHistogram: PRICE_HISTOGRAM_MOCK_UZ
	}
};

export const getMocksByLocale = (locale: TAppLocale): ICatalogLocaleMocks =>
	MOCKS_BY_LOCALE[locale];
