import { LanguageCode } from "@/shared/api";

const LOCALE_TO_LANGUAGE: Record<string, LanguageCode> = {
	ru: LanguageCode.Ru,
	en: LanguageCode.En,
	es: LanguageCode.Es,
	it: LanguageCode.It,
	pt: LanguageCode.Pt,
	uz: LanguageCode.Uz,
	de: LanguageCode.De,
	fr: LanguageCode.Fr,
	zh: LanguageCode.Zh,
	ja: LanguageCode.Ja,
	ko: LanguageCode.Ko,
	ar: LanguageCode.Ar,
	tr: LanguageCode.Tr,
	hi: LanguageCode.Hi
};

export const mapLocaleToLanguageCode = (
	locale: string | undefined
): LanguageCode => {
	if (!locale) return LanguageCode.En;
	const base = locale.split("-")[0]?.toLowerCase() ?? "en";
	return LOCALE_TO_LANGUAGE[base] ?? LanguageCode.En;
};
