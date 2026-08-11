import type { BookingOrderClientDetail, LanguageCode } from "../Api";

// AUTO-GENERATED — не редактировать вручную
// Сгенерировано скриптом scripts/generate-api-paths.ts

export const BOOKING_ORDER_AGENCY_PATHS = {
	getAgencyBookingOrder: (bookingId: string) =>
		({
			url: `/booking/order/agency/${bookingId}`,
			method: "GET",
			_types: {} as {
				body: void;
				query: { lang?: LanguageCode };
				response: BookingOrderClientDetail;
			}
		}) as const
} as const;
