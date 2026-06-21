import { Building, type LucideIcon, Plane } from "lucide-react";

import {
	ENUM_CATALOG_PICKUP_TYPE,
	type ENUM_CATALOG_PICKUP_TYPE_TYPE
} from "@/entities/tour/catalog";

export const PICKUP_ICONS: Record<ENUM_CATALOG_PICKUP_TYPE_TYPE, LucideIcon> = {
	[ENUM_CATALOG_PICKUP_TYPE.AIRPORT]: Plane,
	[ENUM_CATALOG_PICKUP_TYPE.HOTEL]: Building
};
