export const ENUM_ORDER_TYPE_OPTIONS = {
	REGULAR: "Regular",
	VIP: "VIP",
	GROUP: "Group"
} as const;

export type ENUM_ORDER_TYPE_OPTIONS_TYPE =
	(typeof ENUM_ORDER_TYPE_OPTIONS)[keyof typeof ENUM_ORDER_TYPE_OPTIONS];
