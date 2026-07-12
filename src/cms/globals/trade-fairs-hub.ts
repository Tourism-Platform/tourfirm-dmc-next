import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const TradeFairsHub: GlobalConfig = {
	slug: "trade-fairs-hub",
	admin: {
		description: "Landing content for the /company/trade-fairs hub."
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
