import { ENUM_API_TAGS, baseApi } from "@/shared/api";
import type { IPaginationResponse } from "@/shared/types";

import {
	mapCatalogToursToFrontend,
	mapFilterOptionsToFrontend,
	mapRecentlySearchesToFrontend
} from "../converters";
import type {
	ICatalogTourBackend,
	ICatalogTourCard,
	IFilterOption,
	IFilterOptionBackend,
	IRecentSearch,
	IRecentSearchBackend
} from "../types";

export const catalogTourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
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
	useGetCatalogDestinationsQuery,
	useGetRecentlySearchedToursQuery,
	useGetPopularToursQuery,
	useGetSpecialOfferToursQuery
} = catalogTourApi;
