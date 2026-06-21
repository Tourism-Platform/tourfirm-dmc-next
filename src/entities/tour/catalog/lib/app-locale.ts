export type TAppLocale = "en" | "ru" | "uz";

const DEFAULT_LOCALE: TAppLocale = "en";

export function normalizeAppLocale(locale?: string | null): TAppLocale {
	if (locale === "ru" || locale === "uz" || locale === "en") return locale;
	return DEFAULT_LOCALE;
}
