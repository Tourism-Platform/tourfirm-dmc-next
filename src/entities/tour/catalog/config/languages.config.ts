import type { TOptionsKeys } from "@/shared/i18n/i18n.config";

import {
	ENUM_CATALOG_LANGUAGES,
	type ENUM_CATALOG_LANGUAGES_TYPE
} from "../types/catalog-labels.types";

export const CATALOG_LANGUAGES_LABELS: Record<
	ENUM_CATALOG_LANGUAGES_TYPE,
	TOptionsKeys
> = {
	[ENUM_CATALOG_LANGUAGES.ENGLISH]: "tour.languages.english",
	[ENUM_CATALOG_LANGUAGES.RUSSIAN]: "tour.languages.russian",
	[ENUM_CATALOG_LANGUAGES.SPANISH]: "tour.languages.spanish",
	[ENUM_CATALOG_LANGUAGES.ITALIAN]: "tour.languages.italian",
	[ENUM_CATALOG_LANGUAGES.FRENCH]: "tour.languages.french",
	[ENUM_CATALOG_LANGUAGES.CHINESE]: "tour.languages.chinese",
	[ENUM_CATALOG_LANGUAGES.JAPANESE]: "tour.languages.japanese",
	[ENUM_CATALOG_LANGUAGES.UZBEK]: "tour.languages.uzbek",
	[ENUM_CATALOG_LANGUAGES.PORTUGUESE]: "tour.languages.portuguese"
};
