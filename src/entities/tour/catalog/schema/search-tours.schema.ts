import { z } from "zod";

import { type TMainPageKeys, i18nKey } from "@/shared/i18n";

const msg = i18nKey<TMainPageKeys>();

const dateRangeSchema = z.object({
	from: z.union([z.date(), z.undefined()]),
	to: z.union([z.date(), z.undefined()]).optional()
});

export const searchToursSchema = z.object({
	destination: z.string().min(1, { message: msg("search.where.required") }),
	dates: dateRangeSchema.optional()
});

export type TDateRange = z.infer<typeof dateRangeSchema>;
export type TSearchTours = z.infer<typeof searchToursSchema>;
export type TSearchToursSchema = TSearchTours;
