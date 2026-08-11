import type { BookingOrderDetail, LanguageCode } from "../Api";

export const BOOKING_ORDER_OPERATOR_PATHS = {
	getOperatorBookingOrder: (bookingId: string) =>
		({
			url: `/booking/order/operator/${bookingId}`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { lang?: LanguageCode };
				response: BookingOrderDetail;
			}
		}) as const
} as const;
