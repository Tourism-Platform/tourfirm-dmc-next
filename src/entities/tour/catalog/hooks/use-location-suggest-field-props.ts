import { useCallback } from "react";

import { LanguageCode } from "@/shared/api";

import type { TLocationSuggestOption } from "../types";

import { useLocationSuggestOptions } from "./use-location-suggest-options";

export type TLocationSuggestFieldProps = {
	options: TLocationSuggestOption[];
	onQueryChange: (query: string) => void;
	isLoading: boolean;
};

export const useLocationSuggestFieldProps = (
	language: LanguageCode = LanguageCode.En
): TLocationSuggestFieldProps => {
	const suggest = useLocationSuggestOptions({ language });

	const onQueryChange = useCallback(
		(value: string) => {
			suggest.setQuery(value);
		},
		[suggest]
	);

	return {
		options: suggest.options,
		onQueryChange,
		isLoading: suggest.isLoading
	};
};
