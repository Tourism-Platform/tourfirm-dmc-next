import type { TFileMetadata } from "@/shared/hooks";
import { formatDate, formatDateToISO } from "@/shared/utils";

import type {
	Gender,
	IBookingPax,
	TBookingPaxBackend,
	TBookingPaxListBackendResponse,
	TPaxCreateBackend,
	TPaxReviewDetail,
	TPaxReviewItem,
	TPaxUpdateBackend
} from "../types";

export interface ITravellerPaxInput {
	pax_id?: string;
	first_name?: string;
	last_name?: string;
	gender?: Gender;
	nationality?: string;
	date_of_birth?: Date | string;
	passport_number?: string;
	passport_expiry?: Date | string;
	note?: string;
	file?: TFileMetadata[];
}

const splitFullName = (fullName: string) => {
	const parts = fullName.trim().split(/\s+/);
	const firstName = parts[0] ?? "";
	const lastName = parts.slice(1).join(" ");

	return { firstName, lastName };
};

export const getTravellerPassportFile = (
	traveller: ITravellerPaxInput
): File | null => {
	const entry = traveller.file?.find((f) => f.file instanceof File);
	return entry?.file instanceof File ? entry.file : null;
};

export const hasTravellerPassportFile = (traveller: ITravellerPaxInput) =>
	Boolean(getTravellerPassportFile(traveller));

export const mapBookingPaxToFrontend = (
	data: TBookingPaxBackend
): IBookingPax => ({
	id: data.id,
	bookingId: data.booking_id,
	name: data.full_name,
	surname: data.full_name,
	gender: data.gender,
	nationality: data.nationality,
	dateOfBirth: formatDate(data.date_of_birth),
	passportNum: data.passport_number,
	passportExpiryDate: formatDate(data.expired_date),
	comment: data.comment,
	files: (data.files ?? []).map((file) => ({
		id: file.id,
		fileName: file.file_name
	}))
});

export const mapBookingPaxToTravellerForm = (
	pax: IBookingPax
): ITravellerPaxInput => {
	const { firstName, lastName } = splitFullName(pax.name);

	return {
		pax_id: pax.id,
		first_name: firstName,
		last_name: lastName,
		gender: pax.gender,
		nationality: pax.nationality,
		date_of_birth: new Date(pax.dateOfBirth),
		passport_number: pax.passportNum,
		passport_expiry: new Date(pax.passportExpiryDate),
		note: pax.comment ?? undefined
	};
};

export const mapBookingPaxListToFrontend = (
	response: TBookingPaxListBackendResponse
): IBookingPax[] => response.data.map(mapBookingPaxToFrontend);

export const mapBookingPaxToPaxReviewItem = (
	pax: IBookingPax
): TPaxReviewItem => {
	const items: TPaxReviewDetail[] = [];

	if (pax.comment) {
		items.push({
			id: `${pax.id}-comment`,
			type: "comment",
			value: pax.comment
		});
	}

	for (const file of pax.files) {
		items.push({
			id: file.id,
			type: "file",
			value: file.fileName,
			file: { id: file.id, fileName: file.fileName }
		});
	}

	return {
		id: pax.id,
		fullName: pax.name,
		gender: pax.gender,
		nationality: pax.nationality,
		dateOfBirth: pax.dateOfBirth,
		passportNumber: pax.passportNum,
		expiredDate: pax.passportExpiryDate,
		items
	};
};

export const mapBookingPaxListToPaxReview = (
	data: IBookingPax[]
): TPaxReviewItem[] => data.map(mapBookingPaxToPaxReviewItem);

const isTravellerFieldsComplete = (traveller: ITravellerPaxInput) =>
	Boolean(
		traveller.first_name?.trim() &&
		traveller.last_name?.trim() &&
		traveller.gender &&
		traveller.nationality?.trim() &&
		traveller.date_of_birth &&
		traveller.passport_number?.trim() &&
		traveller.passport_expiry
	);

const isTravellerPassportSatisfied = (traveller: ITravellerPaxInput) =>
	Boolean(traveller.pax_id) || hasTravellerPassportFile(traveller);

export const isTravellerComplete = (
	traveller: ITravellerPaxInput
): traveller is Required<
	Pick<
		ITravellerPaxInput,
		| "first_name"
		| "last_name"
		| "gender"
		| "nationality"
		| "date_of_birth"
		| "passport_number"
		| "passport_expiry"
	>
> &
	ITravellerPaxInput =>
	isTravellerFieldsComplete(traveller) &&
	isTravellerPassportSatisfied(traveller);

export const mapTravellerToPaxCreate = (
	traveller: Required<
		Pick<
			ITravellerPaxInput,
			| "first_name"
			| "last_name"
			| "gender"
			| "nationality"
			| "date_of_birth"
			| "passport_number"
			| "passport_expiry"
		>
	> &
		Pick<ITravellerPaxInput, "note">
): TPaxCreateBackend => ({
	full_name: `${traveller.first_name} ${traveller.last_name}`.trim(),
	gender: traveller.gender,
	nationality: traveller.nationality,
	date_of_birth: formatDateToISO(traveller.date_of_birth),
	passport_number: traveller.passport_number,
	expired_date: formatDateToISO(traveller.passport_expiry),
	comment: traveller.note?.trim() || null
});

export const mapTravellerToPaxUpdate = (
	traveller: Required<
		Pick<
			ITravellerPaxInput,
			| "first_name"
			| "last_name"
			| "gender"
			| "nationality"
			| "date_of_birth"
			| "passport_number"
			| "passport_expiry"
		>
	> &
		Pick<ITravellerPaxInput, "note">
): TPaxUpdateBackend => ({
	full_name: `${traveller.first_name} ${traveller.last_name}`.trim(),
	gender: traveller.gender,
	nationality: traveller.nationality,
	date_of_birth: formatDateToISO(traveller.date_of_birth),
	passport_number: traveller.passport_number,
	expired_date: formatDateToISO(traveller.passport_expiry),
	comment: traveller.note?.trim() || null
});
