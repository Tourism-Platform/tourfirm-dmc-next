import type { Field } from "payload";

import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES
} from "../../../config/supported-locales";

export function buildLocaleAvailabilityFields(): Field[] {
	return SUPPORTED_LOCALES.map((code) => ({
		name: code,
		type: "group" as const,
		label: code.toUpperCase(),
		fields: [
			{
				name: "label",
				type: "text" as const,
				required: true
			},
			{
				name: "enabled",
				type: "checkbox" as const,
				defaultValue: code === DEFAULT_LOCALE,
				...(code === DEFAULT_LOCALE
					? { admin: { readOnly: true } }
					: {})
			},
			{
				name: "showInDropdown",
				type: "checkbox" as const,
				defaultValue: code === DEFAULT_LOCALE,
				...(code === DEFAULT_LOCALE
					? { admin: { readOnly: true } }
					: {})
			}
		]
	}));
}
