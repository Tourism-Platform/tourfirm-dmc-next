export const ENUM_PICKUP_TYPE = {
	AIRPORT: "airport",
	HOTEL: "hotel"
} as const;

export type TEnumPickupTypeType =
	(typeof ENUM_PICKUP_TYPE)[keyof typeof ENUM_PICKUP_TYPE];
