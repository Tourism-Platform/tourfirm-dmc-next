// Technical locale pool — codes only. Labels/enabled live in CMS localeAvailability.
// 1. Add code to SUPPORTED_LOCALES
// 2. npm run seed:full (schema + CMS defaults)
// 3. CMS: label, enabled, showInDropdown
// 4. Optionally: messages/{code}/, seed YAML, translations

export const SUPPORTED_LOCALES = [
	"en",
	"ru",
	"uz",
	"es",
	"de",
	"fr",
	"it",
	"pt",
	"nl",
	"pl",
	"tr",
	"ar",
	"zh",
	"ja",
	"ko",
	"hi"
] as const;

export type TSupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: TSupportedLocale = "en";
