import { BOOKING_ORDER_AGENCY_PATHS, ENUM_API_TAGS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import { mapUserBookingOrderToFrontend } from "../converters";
import type { IUserOrderDetail, TUserOrderDetailBackend } from "../types";

export const bookingOrderAgencyApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		getAgencyBookingOrder: builder.query<IUserOrderDetail, string>({
			query: (bookingId) => ({
				...BOOKING_ORDER_AGENCY_PATHS.getAgencyBookingOrder(bookingId)
			}),
			transformResponse: (response: TUserOrderDetailBackend) =>
				mapUserBookingOrderToFrontend(response),
			providesTags: (_result, _error, id) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id }
			]
		})
	})
});

export const { useGetAgencyBookingOrderQuery } = bookingOrderAgencyApi;
