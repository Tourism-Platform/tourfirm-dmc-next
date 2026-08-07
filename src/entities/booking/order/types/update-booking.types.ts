import type { TCurrency } from "@/shared/api";

export interface IUpdateBookingRequest {
	id: string;
	date: Date | string;
	pax: number;
	comment?: string | null;
}

export interface IUpdatedBooking {
	id: string;
	tourOptionId: string;
	date: string;
	endDate: string;
	pax: number;
	tourAmount: string;
	tourCurrency: TCurrency;
}
