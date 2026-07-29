import type { Field } from "payload";

export const timelineItemFields: Field[] = [
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
		name: "date",
		type: "text",
		localized: true
	},
	{
		name: "icon",
		type: "text",
		// ARCH: Lucide icon string key — getLucideIcon on the frontend
		admin: {
			description:
				'Lucide icon key. Used when block indicatorType is "icon".'
		}
	}
];
