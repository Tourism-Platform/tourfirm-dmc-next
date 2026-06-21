import { ENUM_API_TAGS, baseApi } from "@/shared/api";
import type { IPaginationRequest, IPaginationResponse } from "@/shared/types";

import {
	mapCatalogTourFiltersToQuery,
	mapCatalogToursToFrontend,
	mapFilterOptionsPaginatedToFrontend,
	mapFilterOptionsToFrontend,
	mapPriceHistogramToFrontend,
	mapRecentlySearchesToFrontend
} from "../converters";
import type {
	ICatalogTourBackend,
	ICatalogTourCard,
	ICatalogTourFilters,
	IFilterOption,
	IFilterOptionBackend,
	IPriceHistogramItem,
	IPriceHistogramItemBackend,
	IPriceHistogramRequest,
	IRecentSearch,
	IRecentSearchBackend
} from "../types";

export const catalogTourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCatalogTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			ICatalogTourFilters
		>({
			query: (filters) => ({
				url: "/tours/catalog",
				params: mapCatalogTourFiltersToQuery(filters)
			}),
			transformResponse: (response: {
				data: ICatalogTourBackend[];
				total: number;
			}) => mapCatalogToursToFrontend(response.data, response.total),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogRegions: builder.query<
			IPaginationResponse<IFilterOption>,
			IPaginationRequest
		>({
			query: (params) => ({
				url: "/tours/catalog/filters/regions",
				params
			}),
			transformResponse: (
				response: IPaginationResponse<IFilterOptionBackend>
			) => mapFilterOptionsPaginatedToFrontend(response),
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
				url: "/tours/catalog/filters/price-histogram",
				params
			}),
			transformResponse: (response: IPriceHistogramItemBackend[]) =>
				mapPriceHistogramToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogDestinations: builder.query<IFilterOption[], void>({
			query: () => ({ url: "/tours/catalog/filters/destinations" }),
			transformResponse: (response: { data: IFilterOptionBackend[] }) =>
				mapFilterOptionsToFrontend(response.data),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getRecentlySearchedTours: builder.query<IRecentSearch[], void>({
			query: () => ({ url: "/tours/recently-searched" }),
			transformResponse: (response: IRecentSearchBackend[]) =>
				mapRecentlySearchesToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getPopularTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			void
		>({
			query: () => ({ url: "/tours/popular" }),
			transformResponse: (response: { data: ICatalogTourBackend[] }) =>
				mapCatalogToursToFrontend(response.data),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getSpecialOfferTours: builder.query<
			IPaginationResponse<ICatalogTourCard>,
			void
		>({
			query: () => ({ url: "/tours/special-offers" }),
			transformResponse: (response: { data: ICatalogTourBackend[] }) =>
				mapCatalogToursToFrontend(response.data),
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
