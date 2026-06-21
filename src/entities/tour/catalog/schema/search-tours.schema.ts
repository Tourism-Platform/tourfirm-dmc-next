import { z } from "zod";

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

export const searchToursSchema = z.object({
	destination: z.string().optional(),
	dates: dateRangeSchema.optional()
});

export type TDateRange = z.infer<typeof dateRangeSchema>;
export type TSearchTours = z.infer<typeof searchToursSchema>;
export type TSearchToursSchema = TSearchTours;
