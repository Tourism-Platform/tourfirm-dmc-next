import { z } from "zod";

import type { TCatalogLocationBar } from "../types/catalog-query.types";
import { ENUM_LOCATION_SUGGEST_KIND } from "../types/location-suggest.types";

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

const locationSuggestKindSchema = z.enum([
	ENUM_LOCATION_SUGGEST_KIND.CITY,
	ENUM_LOCATION_SUGGEST_KIND.COUNTRY,
	ENUM_LOCATION_SUGGEST_KIND.PLACE
]);

const locationSuggestSchema = z.object({
	value: z.string().min(1),
	kind: locationSuggestKindSchema,
	label: z.string().optional()
});

export function createSearchToursSchema(destinationRequiredMessage: string) {
	return z.object({
		destination: locationSuggestSchema
			.nullable()
			.refine((value) => value !== null, {
				message: destinationRequiredMessage
			}),
		dates: dateRangeSchema.optional()
	});
}

export const searchToursSchema = createSearchToursSchema(
	"Please choose a destination"
);

export type TDateRange = z.infer<typeof dateRangeSchema>;
export type TLocationSuggestFormValue = z.infer<typeof locationSuggestSchema>;
export type TSearchTours = TCatalogLocationBar;
export type TSearchToursSchema = TSearchTours;
