export const ENUM_IMAGE_STATUS = {
	LOADING: "loading",
	LOADED: "loaded",
	ERROR: "error"
} as const;

export type ENUM_IMAGE_STATUS_TYPE =
	(typeof ENUM_IMAGE_STATUS)[keyof typeof ENUM_IMAGE_STATUS];
