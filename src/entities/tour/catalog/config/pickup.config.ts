import type { TOptionsKeys } from "@/shared/i18n/i18n.config";

import {
	ENUM_CATALOG_PICKUP_TYPE,
	type ENUM_CATALOG_PICKUP_TYPE_TYPE
} from "../types/catalog-labels.types";

export const CATALOG_PICKUP_TYPE_LABELS: Record<
	ENUM_CATALOG_PICKUP_TYPE_TYPE,
	TOptionsKeys
> = {
	[ENUM_CATALOG_PICKUP_TYPE.AIRPORT]: "tour.pickup.airport",
	[ENUM_CATALOG_PICKUP_TYPE.HOTEL]: "tour.pickup.hotel"
};
