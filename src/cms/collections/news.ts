import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import {
	revalidateInformationNavAfterChange,
	revalidateInformationNavAfterDelete
} from "../hooks/revalidate-information-nav";

export const News: CollectionConfig = {
	slug: "news",
	admin: {
		useAsTitle: "title"
	},
	access: {
		read: authenticatedOrPublished
	},
	versions: {
		drafts: true
	},
	hooks: {
		afterChange: [revalidateInformationNavAfterChange],
		afterDelete: [revalidateInformationNavAfterDelete]
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
			name: "excerpt",
			type: "textarea",
			localized: true
		},
		{
			name: "heroImage",
			type: "upload",
			relationTo: "media"
		},
		{
			name: "content",
			type: "richText",
			localized: true
		},
		{
			name: "publishDate",
			type: "date"
		},
		{
			name: "categories",
			type: "array",
			fields: [
				{
					name: "category",
					type: "text",
					required: true,
					localized: true
				}
			]
		},
		{
			name: "featured",
			type: "checkbox",
			defaultValue: false
		},
		{
			name: "sortOrder",
			type: "number",
			defaultValue: 0
		},
		{
			name: "blocks",
			type: "blocks",
			required: true,
			localized: true,
			blocks: pageBlocks
		},
		seoField,
		statusField
	]
};
