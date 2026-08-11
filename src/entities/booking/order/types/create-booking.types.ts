import type { TCurrency } from "@/shared/api";

import type { TEnumLanguagesType } from "@/entities/tour/preview-tour";

export type { Gender } from "./gender.types";

export interface ICreateBookingRequest {
	tourOptionId: string;
	date: Date | string;
	pax: number;
	lang: TEnumLanguagesType;
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
