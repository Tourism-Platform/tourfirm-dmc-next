import type { Block, Field } from "payload";

import { routeLineItemFields } from "./route-line-item";

const endpointFields: Field[] = [
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
	}
];

// Item order = block.items[] array position only. Do not add order/index fields.
// Geometry/animation expects exactly 5 stops.
export const RouteLine: Block = {
	slug: "routeLine",
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
			name: "start",
			type: "group",
			fields: endpointFields
		},
		{
			name: "items",
			type: "array",
			label: "Stops",
			minRows: 5,
			maxRows: 5,
			required: true,
			fields: routeLineItemFields
		},
		{
			name: "end",
			type: "group",
			fields: endpointFields
		}
	]
};
