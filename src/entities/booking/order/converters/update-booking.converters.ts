import { formatDateToISO } from "@/shared/utils";

import type {
	IUpdateBookingRequest,
	IUpdatedBooking,
	TBookingModelBackend,
	TBookingUpdateBackend
} from "../types";

export const mapUpdateBookingToBackend = (
	data: IUpdateBookingRequest
): TBookingUpdateBackend => ({
	date: formatDateToISO(data.date),
	pax: data.pax,
	comment: data.comment ?? null
});

export const mapBookingModelToUpdated = (
	data: TBookingModelBackend
): IUpdatedBooking => ({
	id: data.id,
	tourOptionId: data.tour_option_id,
	date: data.date,
	endDate: data.end_date,
	pax: data.pax,
	tourAmount: data.tour_amount,
	tourCurrency: data.tour_currency
});
