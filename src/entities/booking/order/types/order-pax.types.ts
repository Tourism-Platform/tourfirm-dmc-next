import type { BookingPaxFilesModel, BookingPaxModel } from "@/shared/api";

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

export type TUploadPassengerPassportResponse = BookingPaxFilesModel;

export type TAddPassengerResponseBackend = BookingPaxModel;
