export type TGeoLocale = "en" | "ru" | "uz";

export function toGeoLocale(locale: string): TGeoLocale {
	if (locale === "ru" || locale === "uz") {
		return locale;
	}

	return "en";
}
