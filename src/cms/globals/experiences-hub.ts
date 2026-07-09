import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const ExperiencesHub: GlobalConfig = {
	slug: "experiences-hub",
	admin: {
		description: "Landing content for the /experiences discovery hub."
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
