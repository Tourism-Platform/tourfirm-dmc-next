import type { Field } from "payload";

// Item order = aside.items[] array position only. Do not add order/index fields.
export const routeMapAsideItemFields: Field[] = [
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
	},
	{
		name: "badge",
		type: "text",
		localized: true,
		admin: {
			description: "Optional pill label (e.g. transport mode)."
		}
	}
];
