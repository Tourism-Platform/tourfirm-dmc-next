import { Building, type LucideIcon, Plane } from "lucide-react";

import {
	ENUM_PICKUP_TYPE,
	type TEnumPickupTypeType
} from "@/entities/tour/preview-tour";

export const PICKUP_ICONS: Record<TEnumPickupTypeType, LucideIcon> = {
	[ENUM_PICKUP_TYPE.AIRPORT]: Plane,
	[ENUM_PICKUP_TYPE.HOTEL]: Building
};
