export const BOOKING_ORDER_PATHS = {
	createOrder: {
		url: "/booking/order",
		method: "POST"
	},
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
			method: "GET"
		}) as const
} as const;
