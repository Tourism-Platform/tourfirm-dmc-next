import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import { validateAttractionHierarchy } from "../hooks/validate-geo-hierarchy";

const attractionTypeOptions = [
	{ label: "Landmark", value: "LANDMARK" },
	{ label: "Museum", value: "MUSEUM" },
	{ label: "Mosque", value: "MOSQUE" },
	{ label: "Madrasa", value: "MADRASA" },
	{ label: "Mausoleum", value: "MAUSOLEUM" },
	{ label: "Fortress", value: "FORTRESS" },
	{ label: "Palace", value: "PALACE" },
	{ label: "Bazaar", value: "BAZAAR" },
	{ label: "Park", value: "PARK" },
	{ label: "Garden", value: "GARDEN" },
	{ label: "Square", value: "SQUARE" },
	{ label: "Lake", value: "LAKE" },
	{ label: "Mountain", value: "MOUNTAIN" },
	{ label: "Viewpoint", value: "VIEWPOINT" },
	{ label: "Cultural Site", value: "CULTURAL_SITE" },
	{ label: "Natural Site", value: "NATURAL_SITE" },
	{ label: "Religious Site", value: "RELIGIOUS_SITE" }
] as const;

const importanceOptions = [
	{ label: "Must See", value: "MUST_SEE" },
	{ label: "Recommended", value: "RECOMMENDED" },
	{ label: "Optional", value: "OPTIONAL" }
] as const;

export const Attractions: CollectionConfig = {
	slug: "attractions",
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
		beforeValidate: [validateAttractionHierarchy]
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
			name: "country",
			type: "relationship",
			relationTo: "countries",
			required: true
		},
		{
			name: "region",
			type: "relationship",
			relationTo: "regions"
		},
		{
			name: "city",
			type: "relationship",
			relationTo: "cities",
			required: true
		},
		{
			name: "type",
			type: "select",
			options: [...attractionTypeOptions]
		},
		{
			name: "importance",
			type: "select",
			options: [...importanceOptions]
		},
		{
			name: "latitude",
			type: "number",
			required: true
		},
		{
			name: "longitude",
			type: "number",
			required: true
		},
		{
			name: "themes",
			type: "relationship",
			relationTo: "themes",
			hasMany: true
		},
		{
			name: "nearbyAttractions",
			type: "relationship",
			relationTo: "attractions",
			hasMany: true
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
			name: "experiences",
			type: "join",
			collection: "experiences",
			on: "attraction"
		},
		{
			name: "relatedRoutes",
			type: "join",
			collection: "routes",
			on: "attractions"
		}
	]
};
