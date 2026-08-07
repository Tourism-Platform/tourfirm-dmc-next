import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ru from "i18n-iso-countries/langs/ru.json";

import type { TCountryCode } from "./types";

countries.registerLocale(en);
countries.registerLocale(ru);

export const resolveCountryLocale = (lang: string): "en" | "ru" =>
	lang.toLowerCase().startsWith("ru") ? "ru" : "en";

export const isValidCountryCode = (code: string): boolean =>
	countries.isValid(code);

export const getCountryLabel = (code: TCountryCode, lang: string): string => {
	if (!code) return "";

	const locale = resolveCountryLocale(lang);
	const name = countries.getName(code, locale, { select: "official" });

	return name ?? code;
};
