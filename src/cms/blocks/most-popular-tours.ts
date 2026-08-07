import type { Block } from "payload";

export const MostPopularTours: Block = {
	slug: "mostPopularTours",
	labels: {
		singular: "Most Popular Tours",
		plural: "Most Popular Tours"
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
		}
	]
};
