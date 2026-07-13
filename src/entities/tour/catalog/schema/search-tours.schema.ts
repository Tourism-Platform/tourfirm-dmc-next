import { z } from "zod";

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

export function createSearchToursSchema(destinationRequiredMessage: string) {
	return z.object({
		destination: z.string().min(1, { message: destinationRequiredMessage }),
		dates: dateRangeSchema.optional()
	});
}

export const searchToursSchema = createSearchToursSchema(
	"Please choose a destination"
);

export type TDateRange = z.infer<typeof dateRangeSchema>;
export type TSearchTours = z.infer<ReturnType<typeof createSearchToursSchema>>;
export type TSearchToursSchema = TSearchTours;
