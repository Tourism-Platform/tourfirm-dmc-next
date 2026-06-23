import { ENUM_API_TAGS, baseApi } from "@/shared/api";

import {
	mapCatalogPreviewOperatorToFrontend,
	mapCatalogPreviewOptionToFrontend,
	mapCatalogPreviewOptionsListToFrontend,
	mapCatalogPreviewTourGeneralToFrontend,
	mapCatalogPreviewTourToFrontend
} from "../converters";
import { catalogApiCacheKey } from "../lib/app-locale";
import type {
	ICatalogPreviewOperator,
	ICatalogPreviewOperatorBackend,
	ICatalogPreviewOptionCard,
	ICatalogPreviewOptionDetailBackend,
	ICatalogPreviewOptionListItemBackend,
	ICatalogPreviewTourData,
	ICatalogPreviewTourGeneral,
	ICatalogPreviewTourGeneralBackend,
	ICatalogPreviewTourLandingBackend,
	IOptionDetail
} from "../types";

export const catalogPreviewApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCatalogPreviewTourGeneral: builder.query<
			ICatalogPreviewTourGeneral,
			string
		>({
			query: (tourId) => ({
				url: `/tour/${tourId}/public`,
				method: "GET"
			}),
			transformResponse: (response: ICatalogPreviewTourGeneralBackend) =>
				mapCatalogPreviewTourGeneralToFrontend(response),
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				catalogApiCacheKey(endpointName, queryArgs),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogPreviewTour: builder.query<ICatalogPreviewTourData, string>({
			query: (tourId) => ({
				url: `/tour/${tourId}/public/landing`,
				method: "GET"
			}),
			transformResponse: (response: ICatalogPreviewTourLandingBackend) =>
				mapCatalogPreviewTourToFrontend(response),
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				catalogApiCacheKey(endpointName, queryArgs),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogPreviewOperator: builder.query<
			ICatalogPreviewOperator,
			string
		>({
			query: (tourId) => ({
				url: `/tour/${tourId}/public/operator`,
				method: "GET"
			}),
			transformResponse: (response: ICatalogPreviewOperatorBackend) =>
				mapCatalogPreviewOperatorToFrontend(response),
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				catalogApiCacheKey(endpointName, queryArgs),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogPreviewOption: builder.query<
			IOptionDetail,
			{ tourId: string; optionId: string }
		>({
			query: ({ tourId, optionId }) => ({
				url: `/tour/${tourId}/public/option/${optionId}`,
				method: "GET"
			}),
			transformResponse: (response: ICatalogPreviewOptionDetailBackend) =>
				mapCatalogPreviewOptionToFrontend(response),
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				catalogApiCacheKey(endpointName, queryArgs),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		}),
		getCatalogPreviewTourOptions: builder.query<
			ICatalogPreviewOptionCard[],
			string
		>({
			query: (tourId) => ({
				url: `/tour/${tourId}/public/option/all`,
				method: "GET"
			}),
			transformResponse: (
				response: ICatalogPreviewOptionListItemBackend[]
			) => mapCatalogPreviewOptionsListToFrontend(response),
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				catalogApiCacheKey(endpointName, queryArgs),
			providesTags: [ENUM_API_TAGS.TOURS_CATALOG]
		})
	})
});

export const {
	useGetCatalogPreviewTourGeneralQuery,
	useGetCatalogPreviewTourQuery,
	useGetCatalogPreviewOperatorQuery,
	useGetCatalogPreviewOptionQuery,
	useGetCatalogPreviewTourOptionsQuery
} = catalogPreviewApi;
