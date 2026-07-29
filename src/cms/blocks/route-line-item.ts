import type { Field } from "payload";

export const routeLineItemFields: Field[] = [
	{
		name: "title",
		type: "text",
		required: true,
		localized: true
	},
	{
		name: "description",
		type: "richText",
		localized: true
	}
];
