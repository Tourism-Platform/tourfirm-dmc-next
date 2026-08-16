import { SuggestKind } from "@/shared/api";
import { createEnumMapper } from "@/shared/utils";

import {
	ENUM_LOCATION_SUGGEST_KIND,
	type ENUM_LOCATION_SUGGEST_KIND_TYPE
} from "../types/location-suggest.types";

const MAP_SUGGEST_KIND: Record<ENUM_LOCATION_SUGGEST_KIND_TYPE, SuggestKind> = {
	[ENUM_LOCATION_SUGGEST_KIND.CITY]: SuggestKind.City,
	[ENUM_LOCATION_SUGGEST_KIND.COUNTRY]: SuggestKind.Country,
	[ENUM_LOCATION_SUGGEST_KIND.PLACE]: SuggestKind.Place
};

export const suggestKindMapper = createEnumMapper<
	ENUM_LOCATION_SUGGEST_KIND_TYPE,
	SuggestKind
>(MAP_SUGGEST_KIND);
