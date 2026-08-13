import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import { fetchUiGlobals } from "./load-ui-content";
import type {
	TDropdownLanguage,
	TLanguageSetting,
	TLocaleAvailability
} from "./ui-content.types";

type TCmsLocaleEntry = {
	label?: string | null;
	enabled?: boolean | null;
	showInDropdown?: boolean | null;
};
function normalizeLanguageSetting(
	entry: TCmsLocaleEntry | null | undefined
): TLanguageSetting | null {
	if (!entry?.label) {
		return null;
	}
	return {
		label: entry.label,
		enabled: entry.enabled ?? false,
		showInDropdown: entry.showInDropdown ?? false
	};
}
function mapLocaleAvailability(
	raw: Record<string, unknown> | null | undefined
): TLocaleAvailability {
	if (!raw || typeof raw !== "object") {
		return {};
	}
	const result: TLocaleAvailability = {};
	for (const [code, value] of Object.entries(raw)) {
		const setting = normalizeLanguageSetting(
			value as TCmsLocaleEntry | null | undefined
		);
		if (setting) {
			result[code] = setting;
		}
	}
	return result;
}
export const getLocaleAvailability = cache(
	async (): Promise<TLocaleAvailability> => {
		const globals = await fetchUiGlobals("en");
		return mapLocaleAvailability(
			globals["ui-common"].localeAvailability as
				| Record<string, unknown>
				| undefined
		);
	}
);
export function isLocaleEnabled(
	locale: string,
	availability: TLocaleAvailability
): boolean {
	return availability[locale]?.enabled ?? false;
}
export function getEnabledLocales(
	availability: TLocaleAvailability
): TypedLocale[] {
	return Object.entries(availability)
		.filter(([, setting]) => setting.enabled)
		.map(([code]) => code as TypedLocale);
}
export function getDropdownLanguages(
	availability: TLocaleAvailability
): TDropdownLanguage[] {
	return Object.entries(availability)
		.filter(([, setting]) => setting.enabled && setting.showInDropdown)
		.map(([code, setting]) => ({
			code,
			label: setting.label
		}));
}
