import type { Field } from "payload";

export const questionFields: Field[] = [
	{
		name: "icon",
		type: "text",
		required: true
		// ARCH: Lucide icon string key — getLucideIcon on the frontend
	},
	{
		name: "title",
		type: "text",
		required: true,
		localized: true
	},
	{
		name: "description",
		type: "richText",
		required: true,
		localized: true
	}
];
