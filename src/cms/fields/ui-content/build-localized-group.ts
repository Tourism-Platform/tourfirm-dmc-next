import type { Field } from "payload";

import { localizedText } from "./localized-text";

function toCamelCase(key: string): string {
	return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function buildLocalizedGroupFromJson(
	value: Record<string, unknown>,
	label?: string
): Field {
	const fields: Field[] = [];

	for (const [key, nested] of Object.entries(value)) {
		const fieldName = toCamelCase(key);

		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			fields.push(
				buildLocalizedGroupFromJson(
					nested as Record<string, unknown>,
					fieldName
				)
			);
			continue;
		}

		fields.push(localizedText(fieldName, fieldName));
	}

	return {
		name: label ? toCamelCase(label) : undefined,
		type: label ? "group" : undefined,
		label: label ? label : undefined,
		fields: label ? fields : fields
	} as Field;
}

export function buildLocalizedFieldsFromJson(
	value: Record<string, unknown>
): Field[] {
	return Object.entries(value).map(([key, nested]) => {
		const fieldName = toCamelCase(key);

		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			return {
				name: fieldName,
				type: "group",
				label: fieldName,
				fields: buildLocalizedFieldsFromJson(
					nested as Record<string, unknown>
				)
			} satisfies Field;
		}

		return localizedText(fieldName, fieldName);
	});
}
