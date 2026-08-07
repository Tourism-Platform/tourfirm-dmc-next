import type { TCurrency } from "@/shared/api";

export type { Gender } from "./gender.types";

export interface ICreateBookingRequest {
	tourOptionId: string;
	date: Date | string;
	pax: number;
	comment?: string | null;
}

export interface ICreatedBooking {
	id: string;
	tourOptionId: string;
	date: string;
	endDate: string;
	pax: number;
	tourAmount: string;
	tourCurrency: TCurrency;
}

export type TSubmittedBooking = ICreatedBooking;
