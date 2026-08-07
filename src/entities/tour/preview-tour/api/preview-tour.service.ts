import { ENUM_API_TAGS, TOUR_PUBLIC_PATHS, baseApi } from "@/shared/api";

import {
	mapPreviewOperatorToFrontend,
	mapPreviewOptionToFrontend,
	mapPreviewOptionsListToFrontend,
	mapPreviewTourGeneralToFrontend,
	mapPreviewTourScheduleToFrontend,
	mapPreviewTourToFrontend
} from "../converters";
import type {
	IOptionDetail,
	IPreviewOperator,
	IPreviewOptionCard,
	IPreviewTourData,
	IPreviewTourGeneral,
	IPreviewTourSchedule,
	TGetPreviewTourBackendResponse,
	TOptionDetailBackend,
	TPreviewOperatorBackend,
	TPreviewOptionListItemBackend,
	TPreviewTourBackend,
	TPreviewTourScheduleBackend
} from "../types";

export const tourPreviewTourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPreviewTourGeneral: builder.query<IPreviewTourGeneral, string>({
			query: (tourId) => ({
				...TOUR_PUBLIC_PATHS.getTour(tourId)
			}),
			transformResponse: (response: TGetPreviewTourBackendResponse) =>
				mapPreviewTourGeneralToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		}),
		getPreviewTour: builder.query<IPreviewTourData, string>({
			query: (tourId) => ({
				...TOUR_PUBLIC_PATHS.getPublicLandingPage(tourId)
			}),
			transformResponse: (response: TPreviewTourBackend) =>
				mapPreviewTourToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		}),
		getPreviewOperator: builder.query<IPreviewOperator, string>({
			query: (tourId) => ({
				...TOUR_PUBLIC_PATHS.getPublicOperatorPreview(tourId)
			}),
			transformResponse: (response: TPreviewOperatorBackend) =>
				mapPreviewOperatorToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		}),
		getPreviewOption: builder.query<
			IOptionDetail,
			{ tourId: string; optionId: string }
		>({
			query: ({ tourId, optionId }) => ({
				...TOUR_PUBLIC_PATHS.getPublicTourOption(tourId, optionId)
			}),
			transformResponse: (response: TOptionDetailBackend) =>
				mapPreviewOptionToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		}),
		getPreviewTourOptions: builder.query<IPreviewOptionCard[], string>({
			query: (tourId) => ({
				...TOUR_PUBLIC_PATHS.listPublicTourOptions(tourId)
			}),
			transformResponse: (response: TPreviewOptionListItemBackend[]) =>
				mapPreviewOptionsListToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		}),
		getPreviewTourSchedule: builder.query<
			IPreviewTourSchedule,
			{ tourId: string; from?: string; to?: string }
		>({
			query: ({ tourId, from, to }) => ({
				...TOUR_PUBLIC_PATHS.getPublicTourSchedule(tourId),
				params:
					from || to
						? { from: from ?? null, to: to ?? null }
						: undefined
			}),
			transformResponse: (response: TPreviewTourScheduleBackend) =>
				mapPreviewTourScheduleToFrontend(response),
			providesTags: [ENUM_API_TAGS.TOUR_PREVIEW]
		})
	})
});

export const {
	useGetPreviewTourGeneralQuery,
	useGetPreviewTourQuery,
	useGetPreviewOperatorQuery,
	useGetPreviewOptionQuery,
	useGetPreviewTourOptionsQuery,
	useGetPreviewTourScheduleQuery
} = tourPreviewTourApi;
