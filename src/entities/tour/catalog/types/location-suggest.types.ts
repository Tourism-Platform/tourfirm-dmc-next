import type { LanguageCode } from "@/shared/api";

export const ENUM_LOCATION_SUGGEST_KIND = {
	CITY: "city",
	COUNTRY: "country",
	PLACE: "place"
} as const;

export type ENUM_LOCATION_SUGGEST_KIND_TYPE =
	(typeof ENUM_LOCATION_SUGGEST_KIND)[keyof typeof ENUM_LOCATION_SUGGEST_KIND];

export type TLocationSuggestParams = {
	search: string;
	language: LanguageCode;
	limit?: number;
};

export type TLocationSuggestion = {
	value: string;
	kind: ENUM_LOCATION_SUGGEST_KIND_TYPE;
	label?: string;
};

export type TLocationSuggestOption = {
	label: string;
	value: string;
	suggestion: TLocationSuggestion;
};
