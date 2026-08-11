import { BOOKING_ORDER_OPERATOR_PATHS, ENUM_API_TAGS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import { mapOperatorBookingOrderToUserDetail } from "../converters";
import type { IUserOrderDetail, TOperatorOrderDetailBackend } from "../types";

export const bookingOrderOperatorApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		getOperatorBookingOrder: builder.query<IUserOrderDetail, string>({
			query: (bookingId) => ({
				...BOOKING_ORDER_OPERATOR_PATHS.getOperatorBookingOrder(
					bookingId
				)
			}),
			transformResponse: (response: TOperatorOrderDetailBackend) =>
				mapOperatorBookingOrderToUserDetail(response),
			providesTags: (_result, _error, id) => [
				{ type: ENUM_API_TAGS.BOOKING_ORDER, id }
			]
		})
	})
});

export const { useGetOperatorBookingOrderQuery } = bookingOrderOperatorApi;
