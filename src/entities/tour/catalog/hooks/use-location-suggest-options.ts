import { useMemo, useState } from "react";

import { LanguageCode } from "@/shared/api";
import { useDebounce } from "@/shared/hooks";

import { useSuggestLocationsQuery } from "../api";
import type { TLocationSuggestOption } from "../types";

const DEFAULT_MIN_QUERY_LENGTH = 2;
const DEFAULT_DEBOUNCE_MS = 400;
const DEFAULT_LIMIT = 10;

type TUseLocationSuggestOptionsParams = {
	language?: LanguageCode;
	limit?: number;
	minQueryLength?: number;
	debounceMs?: number;
};

type TUseLocationSuggestOptionsResult = {
	options: TLocationSuggestOption[];
	isLoading: boolean;
	query: string;
	setQuery: (value: string) => void;
};

export const useLocationSuggestOptions = (
	params: TUseLocationSuggestOptionsParams = {}
): TUseLocationSuggestOptionsResult => {
	const {
		language = LanguageCode.En,
		limit = DEFAULT_LIMIT,
		minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
		debounceMs = DEFAULT_DEBOUNCE_MS
	} = params;

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, debounceMs);

	const trimmedQuery = debouncedQuery.trim();
	const shouldSkip = trimmedQuery.length < minQueryLength;

	const {
		data: options = [],
		isLoading,
		isFetching
	} = useSuggestLocationsQuery(
		{ search: trimmedQuery, language, limit },
		{ skip: shouldSkip }
	);

	const isSearchLoading = useMemo(
		() => !shouldSkip && (isLoading || isFetching),
		[shouldSkip, isLoading, isFetching]
	);

	return {
		options: shouldSkip ? [] : options,
		isLoading: isSearchLoading,
		query,
		setQuery
	};
};
