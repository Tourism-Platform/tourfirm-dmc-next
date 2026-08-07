export const ENUM_LANGUAGES = {
	ENGLISH: "english",
	RUSSIAN: "russian",
	SPANISH: "spanish",
	ITALIAN: "italian",
	FRENCH: "french",
	CHINESE: "chinese",
	JAPANESE: "japanese",
	UZBEK: "uzbek",
	PORTUGUESE: "portuguese"
} as const;

export type TEnumLanguagesType =
	(typeof ENUM_LANGUAGES)[keyof typeof ENUM_LANGUAGES];
