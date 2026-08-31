import type { Field } from "payload";

export const toneField: Field = {
	name: "tone",
	type: "select",
	defaultValue: "default",
	options: [
		{ label: "Default", value: "default" },
		{ label: "Tint", value: "tint" },
		{ label: "Warm", value: "warm" }
	]
};

export const tagsField: Field = {
	name: "tags",
	type: "array",
	fields: [
		{
			name: "label",
			type: "text",
			required: true,
			localized: true
		}
	]
};
