import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const Themes: CollectionConfig = {
	slug: "themes",
	admin: {
		useAsTitle: "title"
	},
	access: {
		read: authenticatedOrPublished
	},
	versions: {
		drafts: true
	},
	fields: [
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			localized: true,
			index: true
		},
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		{
			name: "icon",
			type: "text"
		},
		{
			name: "description",
			type: "textarea",
			localized: true
		},
		{
			name: "blocks",
			type: "blocks",
			required: true,
			localized: true,
			blocks: pageBlocks
		},
		seoField,
		{
			name: "routes",
			type: "join",
			collection: "routes",
			on: "themes"
		},
		{
			name: "experiences",
			type: "join",
			collection: "experiences",
			on: "themes"
		},
		{
			name: "attractions",
			type: "join",
			collection: "attractions",
			on: "themes"
		}
	]
};
