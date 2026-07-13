import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { TLocaleAvailability } from "./ui-content.types";

export const getLocaleAvailability = cache(
	async (): Promise<TLocaleAvailability> => {
		const payload = await getPayload({ config });

		const uiCommon = await payload.findGlobal({
			slug: "ui-common",
			locale: "en",
			depth: 0,
			draft: false
		});

		return {
			en: { enabled: true },
			ru: { enabled: uiCommon.localeAvailability?.ru?.enabled ?? true },
			uz: { enabled: uiCommon.localeAvailability?.uz?.enabled ?? true }
		};
	}
);

export function isLocaleEnabled(
	locale: string,
	availability: TLocaleAvailability
): boolean {
	if (locale === "en") {
		return true;
	}

	return availability[locale as keyof TLocaleAvailability]?.enabled ?? false;
}

export function getEnabledLocales(
	availability: TLocaleAvailability
): TypedLocale[] {
	const locales: TypedLocale[] = ["en"];

	if (availability.ru?.enabled) {
		locales.push("ru");
	}

	if (availability.uz?.enabled) {
		locales.push("uz");
	}

	return locales;
}
