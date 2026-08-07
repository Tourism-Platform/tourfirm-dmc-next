import type { TUiPreviewLabels } from "@/shared/ui-content/ui-preview.types";

import {
	ENUM_LANGUAGES,
	ENUM_PICKUP_TYPE,
	type TEnumLanguagesType,
	type TEnumPickupTypeType
} from "@/entities/tour/preview-tour";

export function getLanguageLabel(
	labels: TUiPreviewLabels["languages"],
	value: TEnumLanguagesType
): string {
	const map: Record<TEnumLanguagesType, keyof TUiPreviewLabels["languages"]> =
		{
			[ENUM_LANGUAGES.ENGLISH]: "english",
			[ENUM_LANGUAGES.RUSSIAN]: "russian",
			[ENUM_LANGUAGES.SPANISH]: "spanish",
			[ENUM_LANGUAGES.ITALIAN]: "italian",
			[ENUM_LANGUAGES.FRENCH]: "french",
			[ENUM_LANGUAGES.CHINESE]: "chinese",
			[ENUM_LANGUAGES.JAPANESE]: "japanese",
			[ENUM_LANGUAGES.UZBEK]: "uzbek",
			[ENUM_LANGUAGES.PORTUGUESE]: "portuguese"
		};

	return labels[map[value]] ?? value;
}

export function getPickupLabel(
	labels: TUiPreviewLabels["pickup"],
	value: TEnumPickupTypeType
): string {
	const map: Record<TEnumPickupTypeType, keyof TUiPreviewLabels["pickup"]> = {
		[ENUM_PICKUP_TYPE.AIRPORT]: "airport",
		[ENUM_PICKUP_TYPE.HOTEL]: "hotel"
	};

	return labels[map[value]] ?? value;
}
