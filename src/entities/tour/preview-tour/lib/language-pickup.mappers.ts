import { LanguageCode, PickupType } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import { ENUM_LANGUAGES, type TEnumLanguagesType } from "./languages.types";
import { ENUM_PICKUP_TYPE, type TEnumPickupTypeType } from "./pickup.types";

const MAP_LANGUAGES: Partial<Record<TEnumLanguagesType, LanguageCode>> = {
	[ENUM_LANGUAGES.RUSSIAN]: LanguageCode.Ru,
	[ENUM_LANGUAGES.ENGLISH]: LanguageCode.En,
	[ENUM_LANGUAGES.SPANISH]: LanguageCode.Es,
	[ENUM_LANGUAGES.ITALIAN]: LanguageCode.It,
	[ENUM_LANGUAGES.PORTUGUESE]: LanguageCode.Pt,
	[ENUM_LANGUAGES.UZBEK]: LanguageCode.Uz
};

const MAP_PICKUP: Partial<Record<TEnumPickupTypeType, PickupType>> = {
	[ENUM_PICKUP_TYPE.AIRPORT]: PickupType.AirportPickup,
	[ENUM_PICKUP_TYPE.HOTEL]: PickupType.HotelPickup
};

export const languageMapper = createEnumMapper<
	TEnumLanguagesType,
	LanguageCode
>(MAP_LANGUAGES);

export const pickupMapper = createEnumMapper<TEnumPickupTypeType, PickupType>(
	MAP_PICKUP
);
