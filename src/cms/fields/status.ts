import type { Field } from "payload";

export const statusField: Field = {
	name: "status",
	type: "group",
	fields: [
		{
			name: "noindex",
			type: "checkbox",
			defaultValue: false
		},
		{
			name: "showInSitemap",
			type: "checkbox",
			defaultValue: true
		},
		{
			name: "publishedAt",
			type: "date"
		}
	]
};
