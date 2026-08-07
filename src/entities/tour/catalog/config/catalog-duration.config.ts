import {
	ENUM_CATALOG_DURATION,
	type ENUM_CATALOG_DURATION_TYPE
} from "../types";

export const CATALOG_DURATION_PRESETS: Record<
	ENUM_CATALOG_DURATION_TYPE,
	{ from: number; to: number; labelKey: string }
> = {
	[ENUM_CATALOG_DURATION.HALF_DAY]: {
		from: 0,
		to: 1,
		labelKey: "tour.catalogDurations.half_day"
	},
	[ENUM_CATALOG_DURATION.FULL_DAY]: {
		from: 1,
		to: 1,
		labelKey: "tour.catalogDurations.full_day"
	},
	[ENUM_CATALOG_DURATION.MULTI_DAYS]: {
		from: 2,
		to: 15,
		labelKey: "tour.catalogDurations.multi_days"
	}
};

export const CATALOG_DURATION_KEYS = Object.values(
	ENUM_CATALOG_DURATION
) as ENUM_CATALOG_DURATION_TYPE[];
