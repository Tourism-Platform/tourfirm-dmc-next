import type { Field } from "payload";

export function localizedText(name: string, label?: string): Field {
	return {
		name,
		type: "text",
		localized: true,
		label
	};
}
