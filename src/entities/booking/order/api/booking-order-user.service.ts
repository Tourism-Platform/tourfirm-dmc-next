import { BOOKING_ORDER_USER_PATHS, ENUM_API_TAGS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import { mapUserBookingOrderToFrontend } from "../converters";
import type { IUserOrderDetail, TUserOrderDetailBackend } from "../types";

export const bookingOrderUserApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		getUserBookingOrder: builder.query<IUserOrderDetail, string>({
			query: (bookingId) => ({
				...BOOKING_ORDER_USER_PATHS.getUserBookingOrder(bookingId)
			}),
			transformResponse: (response: TUserOrderDetailBackend) =>
				mapUserBookingOrderToFrontend(response),
			providesTags: (_result, _error, id) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id }
			]
		})
	})
});

export const { useGetUserBookingOrderQuery } = bookingOrderUserApi;
