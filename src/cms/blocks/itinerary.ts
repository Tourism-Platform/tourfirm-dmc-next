import type { Block } from "payload";

import { itineraryItemFields } from "./itinerary-item";

// Item order = block.items[] array position only. Do not add order/index fields.
export const Itinerary: Block = {
	slug: "itinerary",
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
			name: "note",
			type: "text",
			localized: true
		},
		{
			name: "items",
			type: "array",
			label: "Items",
			fields: itineraryItemFields
		}
	]
};
