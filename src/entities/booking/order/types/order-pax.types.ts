import type { Gender } from "./gender.types";

export type TBookingPaxFile = {
	id: string;
	fileName: string;
};

export interface IBookingPax {
	id: string;
	bookingId: string;
	name: string;
	surname: string;
	gender: Gender;
	nationality: string;
	dateOfBirth: string;
	passportNum: string;
	passportExpiryDate: string;
	comment: string | null;
	files: TBookingPaxFile[];
}

export interface IUploadPassengerPassportRequest {
	bookingId: string;
	paxId: string;
	file: File;
}

export type TUploadPassengerPassportResponse = {
	id: string;
	booking_pax_id: string;
	url: string;
	file_name: string;
};

export type TAddPassengerResponseBackend = {
	id: string;
	booking_id: string;
};
