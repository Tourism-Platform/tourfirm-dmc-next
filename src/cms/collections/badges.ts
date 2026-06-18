import type { CollectionConfig } from "payload";

export const Badges: CollectionConfig = {
	slug: "badges",
	admin: {
		useAsTitle: "title"
	},
	access: {
		read: () => true
	},
	fields: [
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			index: true
		},
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		{
			name: "color",
			type: "text"
		},
		{
			name: "icon",
			type: "text"
		}
	]
};
