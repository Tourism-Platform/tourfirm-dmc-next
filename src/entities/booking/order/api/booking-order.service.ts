import { BOOKING_ORDER_PATHS, ENUM_API_TAGS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import {
	mapBookingModelToCreated,
	mapBookingModelToUpdated,
	mapCreateBookingToBackend,
	mapUpdateBookingToBackend
} from "../converters";
import type {
	ICreateBookingRequest,
	ICreatedBooking,
	IUpdateBookingRequest,
	IUpdatedBooking,
	TBookingModelBackend,
	TSubmittedBooking
} from "../types";

export const bookingOrderApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		createBookingOrder: builder.mutation<
			ICreatedBooking,
			ICreateBookingRequest
		>({
			query: (body) => ({
				...BOOKING_ORDER_PATHS.createOrder,
				body: mapCreateBookingToBackend(body)
			}),
			transformResponse: (response: TBookingModelBackend) =>
				mapBookingModelToCreated(response),
			invalidatesTags: [ENUM_API_TAGS.BOOKING_ORDER]
		}),
		updateBookingOrder: builder.mutation<
			IUpdatedBooking,
			IUpdateBookingRequest
		>({
			query: (body) => ({
				...BOOKING_ORDER_PATHS.updateOrder(body.id),
				body: mapUpdateBookingToBackend(body)
			}),
			transformResponse: (response: TBookingModelBackend) =>
				mapBookingModelToUpdated(response),
			invalidatesTags: [ENUM_API_TAGS.BOOKING_ORDER]
		}),
		submitBookingOrder: builder.mutation<TSubmittedBooking, string>({
			query: (bookingId) => ({
				...BOOKING_ORDER_PATHS.submitOrder(bookingId)
			}),
			transformResponse: (response: TBookingModelBackend) =>
				mapBookingModelToCreated(response),
			invalidatesTags: (_result, _error, bookingId) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id: bookingId },
				ENUM_API_TAGS.BOOKING_ORDER
			]
		})
	})
});

export const {
	useCreateBookingOrderMutation,
	useUpdateBookingOrderMutation,
	useSubmitBookingOrderMutation
} = bookingOrderApi;
