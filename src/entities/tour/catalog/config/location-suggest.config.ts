import type { LucideIcon } from "lucide-react";
import { Building2, Globe, MapPin } from "lucide-react";

import {
	ENUM_LOCATION_SUGGEST_KIND,
	type ENUM_LOCATION_SUGGEST_KIND_TYPE
} from "../types/location-suggest.types";

export const LOCATION_SUGGEST_KIND_ICONS: Record<
	ENUM_LOCATION_SUGGEST_KIND_TYPE,
	LucideIcon
> = {
	[ENUM_LOCATION_SUGGEST_KIND.CITY]: Building2,
	[ENUM_LOCATION_SUGGEST_KIND.COUNTRY]: Globe,
	[ENUM_LOCATION_SUGGEST_KIND.PLACE]: MapPin
};

export const LOCATION_SUGGEST_KIND_BADGE_CLASS: Record<
	ENUM_LOCATION_SUGGEST_KIND_TYPE,
	string
> = {
	[ENUM_LOCATION_SUGGEST_KIND.CITY]: "bg-emerald-500/10 text-emerald-600",
	[ENUM_LOCATION_SUGGEST_KIND.COUNTRY]: "bg-sky-500/10 text-sky-600",
	[ENUM_LOCATION_SUGGEST_KIND.PLACE]: "bg-primary/10 text-primary"
};

export const LOCATION_SUGGEST_KIND_LABELS: Record<
	ENUM_LOCATION_SUGGEST_KIND_TYPE,
	string
> = {
	[ENUM_LOCATION_SUGGEST_KIND.CITY]: "City",
	[ENUM_LOCATION_SUGGEST_KIND.COUNTRY]: "Country",
	[ENUM_LOCATION_SUGGEST_KIND.PLACE]: "Place"
};

export const getLocationSuggestKindIcon = (
	kind: ENUM_LOCATION_SUGGEST_KIND_TYPE
): LucideIcon => LOCATION_SUGGEST_KIND_ICONS[kind];

export const getLocationSuggestKindBadgeClass = (
	kind: ENUM_LOCATION_SUGGEST_KIND_TYPE
): string => LOCATION_SUGGEST_KIND_BADGE_CLASS[kind];
