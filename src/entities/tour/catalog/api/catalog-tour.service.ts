import {
	DEFAULT_CATALOG_SECTION_QUERY,
	ENUM_API_TAGS,
	TOUR_CATALOG_PATHS,
	baseApi
} from "@/shared/api";
import type { IPaginationRequest, IPaginationResponse } from "@/shared/types";

import {
	mapCatalogFilterPaginatedToFrontend,
	mapCatalogTourFiltersToPublicCatalogQuery,
	mapCatalogTourPaginatedToFrontend,
	mapFilterOptionsToFrontend,
	mapPriceHistogramToFrontend,
	mapRecentlySearchesToFrontend
} from "../converters";
import type {
	ICatalogTourCard,
	ICatalogTourFilters,
	IFilterOption,
	IFilterOptionBackend,
	IPriceHistogramItem,
	IPriceHistogramItemBackend,
	IPriceHistogramRequest,
	IRecentSearch,
	IRecentSearchBackend,
	TListCatalogToursBackendResponse
} from "../types";

export const catalogTourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCatalogTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			ICatalogTourFilters
		>({
			query: (filters) => ({
				...TOUR_CATALOG_PATHS.listPublicCatalog,
				params: mapCatalogTourFiltersToPublicCatalogQuery(filters)
			}),
			transformResponse: (
				response: TListCatalogToursBackendResponse,
				_meta,
				arg
			) => mapCatalogTourPaginatedToFrontend(response, arg),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogRegions: builder.query<
			IPaginationResponse<IFilterOption>,
			IPaginationRequest
		>({
			query: (params) => ({
				url: "/catalog/tours/filters/regions",
				params
			}),
			transformResponse: (
				response: IPaginationResponse<IFilterOptionBackend>
			) => mapCatalogFilterPaginatedToFrontend(response),
			serializeQueryArgs: ({ queryArgs }) => {
				const { page, ...rest } = queryArgs;
				void page;
				return rest;
			},
			merge: (currentCache, newItems) => {
				currentCache.data.push(...newItems.data);
				currentCache.total = newItems.total;
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg?.page !== previousArg?.page;
			},
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogPriceHistogram: builder.query<
			IPriceHistogramItem[],
			IPriceHistogramRequest
		>({
			query: (params) => ({
				url: "/catalog/tours/filters/price-histogram",
				params
			}),
			transformResponse: (response: IPriceHistogramItemBackend[]) =>
				mapPriceHistogramToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
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
				mapCatalogTourPaginatedToFrontend(response, {
					page: 1,
					limit: DEFAULT_CATALOG_SECTION_QUERY.limit ?? 12
				}),
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
				mapCatalogTourPaginatedToFrontend(response, {
					page: 1,
					limit: DEFAULT_CATALOG_SECTION_QUERY.limit ?? 12
				}),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		})
	})
});

export const {
	useGetCatalogToursQuery,
	useGetCatalogRegionsQuery,
	useGetCatalogPriceHistogramQuery,
	useGetCatalogDestinationsQuery,
	useGetRecentlySearchedToursQuery,
	useGetPopularToursQuery,
	useGetSpecialOfferToursQuery
} = catalogTourApi;
