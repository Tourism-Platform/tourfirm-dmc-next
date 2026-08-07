/** Locale language code → ISO 3166-1 alpha-2 for country-flag-icons */
const LOCALE_TO_FLAG_COUNTRY: Record<string, string> = {
	en: "GB",
	ru: "RU",
	uz: "UZ",
	es: "ES",
	de: "DE",
	fr: "FR",
	it: "IT",
	pt: "PT",
	nl: "NL",
	pl: "PL",
	tr: "TR",
	ar: "SA",
	zh: "CN",
	ja: "JP",
	ko: "KR",
	hi: "IN"
};

export function mapLocaleToFlagCountry(locale: string): string {
	const normalized =
		locale.split("-")[0]?.toLowerCase() ?? locale.toLowerCase();

	return LOCALE_TO_FLAG_COUNTRY[normalized] ?? normalized.toUpperCase();
}
