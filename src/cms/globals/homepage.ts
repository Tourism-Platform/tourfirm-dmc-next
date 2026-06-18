import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const Homepage: GlobalConfig = {
	slug: "homepage",
	fields: [
		seoField,
		{
			name: "blocks",
			type: "blocks",
			localized: true,
			blocks: pageBlocks
		}
	]
};
