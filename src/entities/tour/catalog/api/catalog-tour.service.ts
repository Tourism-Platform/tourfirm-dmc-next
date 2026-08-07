import {
	DEFAULT_CATALOG_SECTION_QUERY,
	ENUM_API_TAGS,
	TOUR_CATALOG_PATHS,
	baseApi
} from "@/shared/api";
import type { IPaginationResponse } from "@/shared/types";

import {
	mapCatalogTourPaginatedToFrontend,
	mapFilterOptionsToFrontend,
	mapRecentlySearchesToFrontend
} from "../converters";
import type {
	ICatalogTourCard,
	IFilterOption,
	IFilterOptionBackend,
	IRecentSearch,
	IRecentSearchBackend,
	TListCatalogToursBackendResponse
} from "../types";

export const catalogTourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCatalogDestinations: builder.query<IFilterOption[], void>({
			query: () => ({ url: "/catalog/tours/filters/destinations" }),
			transformResponse: (response: { data: IFilterOptionBackend[] }) =>
				mapFilterOptionsToFrontend(response.data),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getRecentlySearchedTours: builder.query<IRecentSearch[], void>({
			query: () => ({ url: "/catalog/recently-searched" }),
			transformResponse: (response: IRecentSearchBackend[]) =>
				mapRecentlySearchesToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getPopularTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			void
		>({
			query: () => ({
				...TOUR_CATALOG_PATHS.listPublicCatalog,
				params: DEFAULT_CATALOG_SECTION_QUERY
			}),
			transformResponse: (response: TListCatalogToursBackendResponse) =>
				mapCatalogTourPaginatedToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getSpecialOfferTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			void
		>({
			query: () => ({
				...TOUR_CATALOG_PATHS.listPublicCatalog,
				params: DEFAULT_CATALOG_SECTION_QUERY
			}),
			transformResponse: (response: TListCatalogToursBackendResponse) =>
				mapCatalogTourPaginatedToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		})
	})
});

export const {
	useGetCatalogDestinationsQuery,
	useGetRecentlySearchedToursQuery,
	useGetPopularToursQuery,
	useGetSpecialOfferToursQuery
} = catalogTourApi;
