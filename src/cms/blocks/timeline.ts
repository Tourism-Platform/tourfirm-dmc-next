import type { Block } from "payload";

import { timelineItemFields } from "./timeline-item";

// Item order = block.items[] array position only. Do not add order/index fields.
export const Timeline: Block = {
	slug: "timeline",
	fields: [
		{
			name: "eyebrow",
			type: "text",
			localized: true
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
			localized: true
		},
		{
			name: "indicatorType",
			type: "select",
			defaultValue: "number",
			required: true,
			options: [
				{ label: "Number", value: "number" },
				{ label: "Icon", value: "icon" }
			]
		},
		{
			name: "items",
			type: "array",
			label: "Items",
			fields: timelineItemFields
		}
	]
};
