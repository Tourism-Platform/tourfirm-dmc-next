export const ENUM_CLIENT_TYPE_OPTIONS = {
	AGENCY: "Agency",
	DIRECT: "Direct",
	CORPORATE: "Corporate"
} as const;

export type ENUM_CLIENT_TYPE_OPTIONS_TYPE =
	(typeof ENUM_CLIENT_TYPE_OPTIONS)[keyof typeof ENUM_CLIENT_TYPE_OPTIONS];
