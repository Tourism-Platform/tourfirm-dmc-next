import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import { validatePageSlug } from "../hooks/validate-page-slug";

export const Pages: CollectionConfig = {
	slug: "pages",
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
			index: true,
			validate: validatePageSlug
		},
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		seoField,
		{
			name: "blocks",
			type: "blocks",
			required: true,
			localized: true,
			blocks: pageBlocks
		},
		{
			name: "showInNav",
			type: "checkbox"
		},
		{
			name: "navLabel",
			type: "text",
			localized: true
		},
		{
			name: "navOrder",
			type: "number"
		},
		statusField
	]
};
