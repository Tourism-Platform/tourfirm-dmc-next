import { TourType } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import {
	ENUM_ORDER_TYPE_OPTIONS,
	type ENUM_ORDER_TYPE_OPTIONS_TYPE
} from "../types";

const MAP_BOOKING_TOUR_TYPE: Partial<
	Record<ENUM_ORDER_TYPE_OPTIONS_TYPE, TourType>
> = {
	[ENUM_ORDER_TYPE_OPTIONS.REGULAR]: TourType.Regular,
	[ENUM_ORDER_TYPE_OPTIONS.VIP]: TourType.Custom,
	[ENUM_ORDER_TYPE_OPTIONS.GROUP]: TourType.Regular
};

export const bookingTourTypeMapper = createEnumMapper<
	ENUM_ORDER_TYPE_OPTIONS_TYPE,
	TourType
>(MAP_BOOKING_TOUR_TYPE);
