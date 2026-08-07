import countries from "i18n-iso-countries";

import { resolveCountryLocale } from "./countries";
import type { TCountryOption } from "./types";

const optionsCache = new Map<string, TCountryOption[]>();

export const getCountryOptions = (lang: string): TCountryOption[] => {
	const locale = resolveCountryLocale(lang);
	const cached = optionsCache.get(locale);

	if (cached) {
		return cached;
	}

	const localized = countries.getNames(locale, { select: "official" });
	const english = countries.getNames("en", { select: "official" });

	const options = Object.entries(localized)
		.map(([code, label]) => {
			const enName = english[code];
			const searchParts =
				locale === "en"
					? [label, code]
					: [label, code, enName].filter(Boolean);

			return {
				value: code,
				label,
				searchValue: searchParts.join(" ")
			};
		})
		.sort((a, b) => a.label.localeCompare(b.label, locale));

	optionsCache.set(locale, options);

	return options;
};
