import { BOOKING_PASSENGER_PATHS, ENUM_API_TAGS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import { mapBookingPaxListToFrontend } from "../converters";
import type {
	IBookingPax,
	IUploadPassengerPassportRequest,
	TAddPassengerResponseBackend,
	TBookingPaxBackend,
	TBookingPaxFilesBackend,
	TBookingPaxListBackendResponse,
	TPaxCreateBackend,
	TPaxUpdateBackend,
	TUploadPassengerPassportResponse
} from "../types";

export const bookingPaxApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		listPassengerInfo: builder.query<IBookingPax[], string>({
			query: (id) => ({
				...BOOKING_PASSENGER_PATHS.listPassengerInfo(id)
			}),
			transformResponse: (response: TBookingPaxListBackendResponse) =>
				mapBookingPaxListToFrontend(response),
			providesTags: (_result, _error, id) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: `PAX_${id}` }
			]
		}),
		addPassengerInfo: builder.mutation<
			TBookingPaxBackend,
			{ id: string; data: TPaxCreateBackend }
		>({
			query: ({ id, data }) => ({
				...BOOKING_PASSENGER_PATHS.addPassengerInfo(id),
				body: data
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: `PAX_${id}` }
			]
		}),
		updatePassengerInfo: builder.mutation<
			TBookingPaxBackend,
			{ bookingId: string; paxId: string; data: TPaxUpdateBackend }
		>({
			query: ({ bookingId, paxId, data }) => ({
				...BOOKING_PASSENGER_PATHS.updatePassengerInfo(
					bookingId,
					paxId
				),
				body: data
			}),
			invalidatesTags: (_result, _error, { bookingId }) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: `PAX_${bookingId}` }
			]
		}),
		deletePassengerInfo: builder.mutation<
			void,
			{ bookingId: string; paxId: string }
		>({
			query: ({ bookingId, paxId }) => ({
				...BOOKING_PASSENGER_PATHS.deletePassengerInfo(bookingId, paxId)
			}),
			invalidatesTags: (_result, _error, { bookingId }) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: `PAX_${bookingId}` }
			]
		}),
		uploadPassengerPassport: builder.mutation<
			TUploadPassengerPassportResponse,
			IUploadPassengerPassportRequest
		>({
			query: ({ bookingId, paxId, file }) => {
				const formData = new FormData();
				formData.append("file", file);
				return {
					...BOOKING_PASSENGER_PATHS.uploadPassengerPassport(
						bookingId,
						paxId
					),
					body: formData
				};
			},
			invalidatesTags: (_result, _error, { bookingId }) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: `PAX_${bookingId}` }
			]
		})
	})
});

export const {
	useListPassengerInfoQuery,
	useAddPassengerInfoMutation,
	useUpdatePassengerInfoMutation,
	useDeletePassengerInfoMutation,
	useUploadPassengerPassportMutation
} = bookingPaxApi;

export type { TBookingPaxFilesBackend, TAddPassengerResponseBackend };
