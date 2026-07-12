import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";

export const TradeFairs: CollectionConfig = {
	slug: "trade-fairs",
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
			name: "stand",
			type: "text",
			localized: true
		},
		{
			name: "participants",
			type: "text",
			localized: true
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
			name: "content",
			type: "richText",
			localized: true
		},
		{
			name: "startDate",
			type: "date"
		},
		{
			name: "endDate",
			type: "date"
		},
		{
			name: "cityRelation",
			type: "relationship",
			relationTo: "cities"
		},
		{
			name: "cityName",
			type: "text",
			localized: true
		},
		{
			name: "countryName",
			type: "text",
			localized: true
		},
		{
			name: "website",
			type: "text"
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
		statusField
	]
};
