import { z } from "zod";

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

const geoDestinationSchema = z.object({
	lat: z.number(),
	long: z.number(),
	label: z.string().nullish(),
	name: z.string().nullish(),
	city: z.string().nullish(),
	street: z.string().nullish(),
	housenumber: z.string().nullish(),
	postcode: z.string().nullish(),
	state: z.string().nullish(),
	country: z.string().nullish(),
	country_code: z.string().nullish()
});

export function createSearchToursSchema(destinationRequiredMessage: string) {
	return z.object({
		destination: geoDestinationSchema
			.nullable()
			.refine((value) => value !== null && Number.isFinite(value.lat), {
				message: destinationRequiredMessage
			}),
		dates: dateRangeSchema.optional()
	});
}

export const searchToursSchema = createSearchToursSchema(
	"Please choose a destination"
);

export type TDateRange = z.infer<typeof dateRangeSchema>;
export type TSearchTours = z.infer<ReturnType<typeof createSearchToursSchema>>;
export type TSearchToursSchema = TSearchTours;
