export const ENUM_CATALOG_DURATION = {
	HALF_DAY: "half_day",
	FULL_DAY: "full_day",
	MULTI_DAYS: "multi_days"
} as const;

export type ENUM_CATALOG_DURATION_TYPE =
	(typeof ENUM_CATALOG_DURATION)[keyof typeof ENUM_CATALOG_DURATION];
