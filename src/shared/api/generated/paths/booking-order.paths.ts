import type {
	BookingOrderDetail,
	BookingOrderListResponse,
	BookingStatus
} from "../Api";

export const BOOKING_ORDER_PATHS = {
	createOrder: {
		url: "/booking/order",
		method: "POST"
	},
	listMyBookings: {
		url: "/booking/order/my",
		method: "GET",
		_types: {} as {
			body: void;
			query: {
				booking_status?: BookingStatus | null;
				tour_id?: string | null;
				q?: string | null;
				date_from?: string | null;
				date_to?: string | null;
				skip?: number;
				limit?: number;
			};
			response: BookingOrderListResponse;
		}
	} as const,
	updateOrder: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}`,
			method: "PATCH"
		}) as const,
	submitOrder: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}/submit`,
			method: "PATCH"
		}) as const,
	getOrder: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}`,
			method: "GET",
			_types: {} as {
				body: void;
				query: void;
				response: BookingOrderDetail;
			}
		}) as const
} as const;
