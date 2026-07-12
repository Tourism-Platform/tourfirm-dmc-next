import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const BlogHub: GlobalConfig = {
	slug: "blog-hub",
	admin: {
		description: "Landing content for the /blog discovery hub."
	},
	fields: [
		{
			name: "title",
			type: "text",
			localized: true
		},
		{
			name: "subtitle",
			type: "text",
			localized: true
		},
		seoField,
		{
			name: "blocks",
			type: "blocks",
			localized: true,
			blocks: pageBlocks
		}
	]
};
