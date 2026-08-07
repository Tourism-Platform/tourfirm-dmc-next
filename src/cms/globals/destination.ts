import type { GlobalConfig } from "payload";

import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { revalidateDestinationGlobalCache } from "../hooks/revalidate-layout-cms";
import { validatePageSlug } from "../hooks/validate-page-slug";

export const Destination: GlobalConfig = {
	slug: "destination",
	hooks: {
		afterChange: [revalidateDestinationGlobalCache]
	},
	fields: [
		{
			name: "slug",
			type: "text",
			required: true,
			localized: true,
			validate: validatePageSlug
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
