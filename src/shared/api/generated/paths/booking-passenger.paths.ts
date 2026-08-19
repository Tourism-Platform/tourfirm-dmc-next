import type {
	BodyUploadPassengerPassportBookingOrderBookingIdPaxPaxIdPassportPost,
	BookingPaxFilesModel,
	BookingPaxModel,
	PaxCreate,
	PaxListResponse,
	PaxUpdate
} from "../Api";

export const BOOKING_PASSENGER_PATHS = {
	listPassengerInfo: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}/pax`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { skip?: number; limit?: number };
				response: PaxListResponse;
			}
		}) as const,
	addPassengerInfo: (bookingId: string) =>
		({
			url: `/booking/order/${bookingId}/pax`,
			method: "POST",
			_types: {} as {
				body: PaxCreate;
				query: void;
				response: BookingPaxModel;
			}
		}) as const,
	updatePassengerInfo: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}`,
			method: "PATCH",
			_types: {} as {
				body: PaxUpdate;
				query: void;
				response: BookingPaxModel;
			}
		}) as const,
	deletePassengerInfo: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}`,
			method: "DELETE",
			_types: {} as { body: void; query: void; response: void }
		}) as const,
	uploadPassengerPassport: (bookingId: string, paxId: string) =>
		({
			url: `/booking/order/${bookingId}/pax/${paxId}/passport`,
			method: "POST",
			_types: {} as {
				body: BodyUploadPassengerPassportBookingOrderBookingIdPaxPaxIdPassportPost;
				query: void;
				response: BookingPaxFilesModel;
			}
		}) as const
} as const;
