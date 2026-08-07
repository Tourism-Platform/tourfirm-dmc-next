export const ENUM_PREVIEW_OPTION_EVENT = {
	ACCOMMODATION: "accommodation",
	FLIGHT: "flight",
	TRANSPORTATION: "transportation",
	SUPPLEMENT: "supplement",
	MULTIPLY_OPTION: "multiply-option",
	INFO: "info",
	ACTIVITY: "activity"
} as const;

export type TPreviewOptionEventType =
	(typeof ENUM_PREVIEW_OPTION_EVENT)[keyof typeof ENUM_PREVIEW_OPTION_EVENT];
