import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { catalogBlocks } from "../blocks";
import { seoField } from "../fields/seo";

export const Tours: GlobalConfig = {
	slug: "tours",
	label: "Tours Page",
	access: {
		read: authenticatedOrPublished
	},
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
