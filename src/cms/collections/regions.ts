import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import {
	revalidateDestinationsNavAfterChange,
	revalidateDestinationsNavAfterDelete
} from "../hooks/revalidate-destinations-nav";

export const Regions: CollectionConfig = {
	slug: "regions",
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
		afterChange: [revalidateDestinationsNavAfterChange],
		afterDelete: [revalidateDestinationsNavAfterDelete]
	},
	indexes: [
		{
			fields: ["slug"]
		},
		{
			fields: ["country"]
		}
	],
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
			name: "navOrder",
			type: "number",
			defaultValue: 0,
			admin: {
				description:
					"Header destinations menu sort order. Lower values appear first."
			}
		},
		{
			name: "subtitle",
			type: "text",
			localized: true
		},
		{
			name: "excerpt",
			type: "textarea",
			localized: true
		},
		{
			name: "content",
			type: "richText",
			localized: true
		},
		{
			name: "country",
			type: "relationship",
			relationTo: "countries",
			required: true
		},
		{
			name: "mapCenter",
			type: "group",
			fields: [
				{
					name: "latitude",
					type: "number"
				},
				{
					name: "longitude",
					type: "number"
				}
			]
		},
		{
			name: "heroImage",
			type: "upload",
			relationTo: "media"
		},
		{
			name: "gallery",
			type: "relationship",
			relationTo: "media",
			hasMany: true
		},
		{
			name: "badges",
			type: "relationship",
			relationTo: "badges",
			hasMany: true
		},
		{
			name: "blocks",
			type: "blocks",
			required: true,
			localized: true,
			blocks: pageBlocks
		},
		seoField,
		statusField,
		{
			name: "cities",
			type: "join",
			collection: "cities",
			on: "region"
		}
	]
};
