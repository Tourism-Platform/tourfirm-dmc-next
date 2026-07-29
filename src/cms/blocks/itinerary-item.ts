import type { Field } from "payload";

export const itineraryItemFields: Field[] = [
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
		name: "image",
		type: "upload",
		relationTo: "media"
	},
	{
		name: "meta",
		type: "richText",
		localized: true
	}
];
