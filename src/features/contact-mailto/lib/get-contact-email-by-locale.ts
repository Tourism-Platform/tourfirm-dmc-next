import { routing } from "@/shared/i18n";

const LOCALE_CONTACT_EMAIL = {
	ru: "russian@tourlink.ru",
	en: "english@tourlink.ru",
	uz: "english@tourlink.ru"
} as const;

type TLocale = keyof typeof LOCALE_CONTACT_EMAIL;

export function getContactEmailByLocale(locale: string): string {
	if (locale in LOCALE_CONTACT_EMAIL) {
		return LOCALE_CONTACT_EMAIL[locale as TLocale];
	}

	return LOCALE_CONTACT_EMAIL[routing.defaultLocale as TLocale];
}
