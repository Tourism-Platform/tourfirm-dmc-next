import type { BookingOrderResponse } from "@/shared/api";

import type { Gender } from "./gender.types";

export type TBookingModelBackend = BookingOrderResponse;

export type TBookingCreateBackend = {
	tour_option_id: string;
	date: string;
	pax: number;
	comment?: string | null;
};

export type TBookingUpdateBackend = {
	date?: string | null;
	pax?: number | null;
	comment?: string | null;
};

export type TPaxCreateBackend = {
	full_name: string;
	gender: Gender;
	nationality: string;
	date_of_birth: string;
	passport_number: string;
	expired_date: string;
	comment?: string | null;
};

export type TPaxUpdateBackend = {
	full_name?: string | null;
	gender?: Gender | null;
	nationality?: string | null;
	date_of_birth?: string | null;
	passport_number?: string | null;
	expired_date?: string | null;
	comment?: string | null;
};

export type TPaxFileRefBackend = {
	id: string;
	file_name: string;
};

export type TBookingPaxBackend = {
	id: string;
	booking_id: string;
	full_name: string;
	gender: Gender;
	nationality: string;
	date_of_birth: string;
	passport_number: string;
	expired_date: string;
	comment: string | null;
	files?: TPaxFileRefBackend[];
};

export type TBookingPaxListBackendResponse = {
	count: number;
	data: TBookingPaxBackend[];
};

export type TBookingPaxFilesBackend = {
	id: string;
	booking_pax_id: string;
	url: string;
	file_name: string;
};
