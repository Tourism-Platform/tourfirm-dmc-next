import type { GlobalConfig } from "payload";

import { catalogBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const Tours: GlobalConfig = {
	slug: "tours",
	label: "Tours Page",
	fields: [
		seoField,
		{
			name: "blocks",
			type: "blocks",
			localized: true,
			blocks: catalogBlocks
		}
	]
};
