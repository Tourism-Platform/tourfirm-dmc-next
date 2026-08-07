import { useMemo, useState } from "react";

import { useDebounce } from "@/shared/hooks";

import { useSearchGeoQuery } from "../api";
import { mapLocaleToLanguageCode } from "../lib";
import type { TGeoOption } from "../types";

const DEFAULT_MIN_QUERY_LENGTH = 2;
const DEFAULT_DEBOUNCE_MS = 400;
const DEFAULT_LIMIT = 10;

type TUseGeoSearchOptionsParams = {
	locale?: string;
	limit?: number;
	minQueryLength?: number;
	debounceMs?: number;
};

type TUseGeoSearchOptionsResult = {
	options: TGeoOption[];
	isLoading: boolean;
	query: string;
	setQuery: (value: string) => void;
};

export const useGeoSearchOptions = (
	params: TUseGeoSearchOptionsParams = {}
): TUseGeoSearchOptionsResult => {
	const {
		locale = "en",
		limit = DEFAULT_LIMIT,
		minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
		debounceMs = DEFAULT_DEBOUNCE_MS
	} = params;

	const lang = useMemo(() => mapLocaleToLanguageCode(locale), [locale]);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, debounceMs);

	const trimmedQuery = debouncedQuery.trim();
	const shouldSkip = trimmedQuery.length < minQueryLength;

	const {
		data: options = [],
		isLoading,
		isFetching
	} = useSearchGeoQuery(
		{ q: trimmedQuery, lang, limit },
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
