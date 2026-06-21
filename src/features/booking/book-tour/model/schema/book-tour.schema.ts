import { z } from "zod";

import { type TBookingTourModalKeys, i18nKey } from "@/shared/i18n";

const msg = i18nKey<TBookingTourModalKeys>();

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

export const bookTourSchema = z.object({
	tourId: z.string(),
	tourTitle: z.string(),
	fullName: z
		.string()
		.min(1, { message: msg("validation.full_name_required") }),
	email: z
		.string()
		.min(1, { message: msg("validation.email_required") })
		.email({ message: msg("validation.email_invalid") }),
	phone: z.string().min(1, { message: msg("validation.phone_required") }),
	dates: dateRangeSchema.optional(),
	groupSize: z
		.union([z.number(), z.string()])
		.transform((value) => Number(value))
		.pipe(
			z
				.number({ message: msg("validation.group_size_required") })
				.min(1, { message: msg("validation.group_size_min") })
		),
	message: z.string().optional()
});

export type TBookTourForm = z.input<typeof bookTourSchema>;
export type TBookTour = z.output<typeof bookTourSchema>;
