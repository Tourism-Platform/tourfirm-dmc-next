import type { Block } from "payload";

import { actionFields } from "./action";

export const SpecialOffers: Block = {
	slug: "specialOffers",
	labels: {
		singular: "Special Offers",
		plural: "Special Offers"
	},
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
			name: "actions",
			type: "array",
			fields: actionFields
		}
	]
};
