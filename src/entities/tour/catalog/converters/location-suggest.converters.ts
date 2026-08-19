import type {
	TLocationSuggestionBackend,
	TSuggestLocationsQuery
} from "../types";
import {
	ENUM_LOCATION_SUGGEST_KIND,
	type TLocationSuggestOption,
	type TLocationSuggestParams,
	type TLocationSuggestion
} from "../types/location-suggest.types";

import { suggestKindMapper } from "./suggest-kind.converters";

const SUGGEST_VALUE_SEPARATOR = "::";

export type { TLocationSuggestOption } from "../types/location-suggest.types";

export const encodeLocationSuggestValue = (
	kind: TLocationSuggestion["kind"],
	value: string
): string => `${kind}${SUGGEST_VALUE_SEPARATOR}${value}`;

export const mapLocationSuggestionToFrontend = (
	item: TLocationSuggestionBackend
): TLocationSuggestion => ({
	value: item.value,
	kind: suggestKindMapper.from(item.kind)!,
	label: item.value
});

export const mapLocationSuggestionsToOptions = (
	items: TLocationSuggestionBackend[]
): TLocationSuggestOption[] =>
	items.map((item) => {
		const suggestion = mapLocationSuggestionToFrontend(item);

		return {
			label: suggestion.label ?? suggestion.value,
			value: encodeLocationSuggestValue(
				suggestion.kind,
				suggestion.value
			),
			suggestion
		};
	});

export const mapLocationSuggestParamsToBackend = (
	params: TLocationSuggestParams
): TSuggestLocationsQuery => ({
	q: params.search.trim(),
	read_lang: params.language,
	...(params.limit !== undefined && { limit: params.limit })
});

export const mapSearchQueryToLocationSuggest = (query: {
	city?: string;
	country?: string;
	place?: string;
}): TLocationSuggestion | null => {
	if (query.city) {
		return {
			value: query.city,
			kind: ENUM_LOCATION_SUGGEST_KIND.CITY,
			label: query.city
		};
	}

	if (query.country) {
		return {
			value: query.country,
			kind: ENUM_LOCATION_SUGGEST_KIND.COUNTRY,
			label: query.country
		};
	}

	if (query.place) {
		return {
			value: query.place,
			kind: ENUM_LOCATION_SUGGEST_KIND.PLACE,
			label: query.place
		};
	}

	return null;
};
