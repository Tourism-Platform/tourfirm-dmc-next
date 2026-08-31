import type { Block } from "payload";

import { tagsField, toneField } from "./block-shared-fields";
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
		toneField,
		tagsField,
		{
			name: "layout",
			type: "select",
			defaultValue: "vertical",
			options: [
				{ label: "Vertical", value: "vertical" },
				{ label: "Horizontal", value: "horizontal" }
			]
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
		},
		{
			name: "criteria",
			type: "group",
			fields: [
				{
					name: "label",
					type: "text",
					localized: true
				},
				{
					name: "title",
					type: "text",
					localized: true
				},
				{
					name: "description",
					type: "richText",
					localized: true
				},
				tagsField
			]
		}
	]
};
