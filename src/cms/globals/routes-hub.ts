import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const RoutesHub: GlobalConfig = {
	slug: "routes-hub",
	admin: {
		description: "Landing content for the /routes discovery hub."
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
