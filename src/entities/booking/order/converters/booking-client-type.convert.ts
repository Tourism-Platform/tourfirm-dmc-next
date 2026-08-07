import { BookingClientType } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import {
	ENUM_CLIENT_TYPE_OPTIONS,
	type ENUM_CLIENT_TYPE_OPTIONS_TYPE
} from "../types";

const MAP_BOOKING_CLIENT_TYPE: Partial<
	Record<ENUM_CLIENT_TYPE_OPTIONS_TYPE, BookingClientType>
> = {
	[ENUM_CLIENT_TYPE_OPTIONS.AGENCY]: BookingClientType.Agency,
	[ENUM_CLIENT_TYPE_OPTIONS.DIRECT]: BookingClientType.Tourist,
	[ENUM_CLIENT_TYPE_OPTIONS.CORPORATE]: BookingClientType.Tourist
};

export const bookingClientTypeMapper = createEnumMapper<
	ENUM_CLIENT_TYPE_OPTIONS_TYPE,
	BookingClientType
>(MAP_BOOKING_CLIENT_TYPE);
