export const ENUM_CATALOG_PREVIEW_OPTION_EVENT = {
	ACCOMMODATION: "accommodation",
	FLIGHT: "flight",
	TRANSPORTATION: "transportation",
	MULTIPLY_OPTION: "multiply-option",
	INFO: "info",
	ACTIVITY: "activity"
} as const;

export type TCatalogPreviewOptionEventType =
	(typeof ENUM_CATALOG_PREVIEW_OPTION_EVENT)[keyof typeof ENUM_CATALOG_PREVIEW_OPTION_EVENT];
