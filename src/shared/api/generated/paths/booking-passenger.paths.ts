export const BOOKING_PASSENGER_PATHS = {
	listPassengerInfo: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}/pax`,
			method: "GET"
		}) as const,
	addPassengerInfo: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}/pax`,
			method: "POST"
		}) as const,
	updatePassengerInfo: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}`,
			method: "PATCH"
		}) as const,
	deletePassengerInfo: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}`,
			method: "DELETE"
		}) as const,
	uploadPassengerPassport: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}/passport`,
			method: "POST"
		}) as const
} as const;
