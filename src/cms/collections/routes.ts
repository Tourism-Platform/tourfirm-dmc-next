import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";

export const Routes: CollectionConfig = {
	slug: "routes",
	admin: {
		useAsTitle: "title"
	},
	access: {
		read: authenticatedOrPublished
	},
	versions: {
		drafts: true
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
			name: "countries",
			type: "relationship",
			relationTo: "countries",
			hasMany: true,
			required: true
		},
		{
			name: "cities",
			type: "relationship",
			relationTo: "cities",
			hasMany: true
		},
		{
			name: "attractions",
			type: "relationship",
			relationTo: "attractions",
			hasMany: true
		},
		{
			name: "experiences",
			type: "relationship",
			relationTo: "experiences",
			hasMany: true
		},
		{
			name: "themes",
			type: "relationship",
			relationTo: "themes",
			hasMany: true
		},
		{
			name: "durationDays",
			type: "number"
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
			name: "mapPoints",
			type: "join",
			collection: "map-points",
			on: "route",
			defaultSort: "order"
		}
	]
};
