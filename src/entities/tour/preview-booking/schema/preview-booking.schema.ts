import { z } from "zod";

import { isValidCountryCode } from "@/shared/lib";

import { Gender, hasTravellerPassportFile } from "@/entities/booking";
import {
	ENUM_LANGUAGES,
	type TEnumLanguagesType
} from "@/entities/tour/preview-tour";

export const ENUM_FORM_PREVIEW_BOOKING = {
	DATE: "date",
	TRAVELLERS_COUNT: "travellers_count",
	OPTION_ID: "option_id",
	LANGUAGE: "language",
	TRAVELLERS: "travellers",
	FIRST_NAME: "first_name",
	LAST_NAME: "last_name",
	DATE_OF_BIRTH: "date_of_birth",
	NATIONALITY: "nationality",
	PASSPORT_NUMBER: "passport_number",
	PASSPORT_EXPIRY: "passport_expiry",
	GENDER: "gender",
	NOTE: "note",
	FILE: "file",
	PAX_ID: "pax_id"
} as const;

const FILE_METADATA_SCHEMA = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	url: z.string(),
	file: z.instanceof(File).optional()
});

const isTravellerFieldsComplete = (traveller: {
	pax_id?: string;
	first_name?: string;
	last_name?: string;
	gender?: Gender;
	nationality?: string;
	date_of_birth?: Date;
	passport_number?: string;
	passport_expiry?: Date;
}) =>
	Boolean(
		traveller.first_name?.trim() &&
		traveller.last_name?.trim() &&
		traveller.gender &&
		traveller.nationality?.trim() &&
		traveller.date_of_birth &&
		traveller.passport_number?.trim() &&
		traveller.passport_expiry
	);

const nationalitySchema = z
	.string()
	.optional()
	.refine(
		(value) =>
			value == null ||
			value === "" ||
			(/^[A-Z]{2}$/.test(value) && isValidCountryCode(value)),
		{
			message: "step2.fields.nationality.errors.invalid"
		}
	);

export const TRAVELLER_DETAILS_SCHEMA = z
	.object({
		[ENUM_FORM_PREVIEW_BOOKING.PAX_ID]: z.string().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.FIRST_NAME]: z.string().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.LAST_NAME]: z.string().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.GENDER]: z.nativeEnum(Gender).optional(),
		[ENUM_FORM_PREVIEW_BOOKING.DATE_OF_BIRTH]: z.coerce.date().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.NATIONALITY]: nationalitySchema,
		[ENUM_FORM_PREVIEW_BOOKING.PASSPORT_NUMBER]: z.string().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.PASSPORT_EXPIRY]: z.coerce.date().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.NOTE]: z.string().optional(),
		[ENUM_FORM_PREVIEW_BOOKING.FILE]: z
			.array(FILE_METADATA_SCHEMA)
			.optional()
	})
	.superRefine((traveller, ctx) => {
		if (
			isTravellerFieldsComplete(traveller) &&
			!traveller.pax_id &&
			!hasTravellerPassportFile(traveller)
		) {
			ctx.addIssue({
				code: "custom",
				message: "step2.fields.file.errors.required",
				path: [ENUM_FORM_PREVIEW_BOOKING.FILE]
			});
		}
	});

export const PREVIEW_BOOKING_SCHEMA = z.object({
	[ENUM_FORM_PREVIEW_BOOKING.DATE]: z.coerce.date({
		error: "step1.fields.date.errors.required"
	}),
	[ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT]: z
		.number()
		.min(1, { message: "step1.travellers.errors.min" })
		.max(20, { message: "step1.travellers.errors.max" }),
	[ENUM_FORM_PREVIEW_BOOKING.OPTION_ID]: z
		.string()
		.min(1, { message: "step1.options.errors.required" }),
	[ENUM_FORM_PREVIEW_BOOKING.LANGUAGE]: z.nativeEnum(ENUM_LANGUAGES, {
		error: "step1.language.errors.required"
	}),
	[ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS]: z.array(TRAVELLER_DETAILS_SCHEMA)
});

export const PREVIEW_BOOKING_DEFAULT_VALUES = {
	[ENUM_FORM_PREVIEW_BOOKING.DATE]: undefined as Date | undefined,
	[ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS_COUNT]: 1,
	[ENUM_FORM_PREVIEW_BOOKING.OPTION_ID]: "",
	[ENUM_FORM_PREVIEW_BOOKING.LANGUAGE]: undefined as
		| TEnumLanguagesType
		| undefined,
	[ENUM_FORM_PREVIEW_BOOKING.TRAVELLERS]: [{}]
} as Partial<z.infer<typeof PREVIEW_BOOKING_SCHEMA>>;

export type TPreviewBookingSchema = z.infer<typeof PREVIEW_BOOKING_SCHEMA>;
