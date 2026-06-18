import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import { validateExperienceHierarchy } from "../hooks/validate-geo-hierarchy";

const experienceTypeOptions = [
	{ label: "Workshop", value: "WORKSHOP" },
	{ label: "Masterclass", value: "MASTERCLASS" },
	{ label: "Tasting", value: "TASTING" },
	{ label: "Guided Tour", value: "GUIDED_TOUR" },
	{ label: "Food Experience", value: "FOOD_EXPERIENCE" },
	{ label: "Cultural Event", value: "CULTURAL_EVENT" },
	{ label: "Performance", value: "PERFORMANCE" },
	{ label: "Outdoor Activity", value: "OUTDOOR_ACTIVITY" },
	{ label: "Adventure Activity", value: "ADVENTURE_ACTIVITY" },
	{ label: "Wellness Activity", value: "WELLNESS_ACTIVITY" },
	{ label: "Stay Experience", value: "STAY_EXPERIENCE" }
] as const;

export const Experiences: CollectionConfig = {
	slug: "experiences",
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
		beforeValidate: [validateExperienceHierarchy]
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
			name: "type",
			type: "select",
			options: [...experienceTypeOptions]
		},
		{
			name: "themes",
			type: "relationship",
			relationTo: "themes",
			hasMany: true
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
			relationTo: "cities"
		},
		{
			name: "attraction",
			type: "relationship",
			relationTo: "attractions"
		},
		{
			name: "duration",
			type: "text"
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
			name: "relatedRoutes",
			type: "join",
			collection: "routes",
			on: "experiences"
		}
	]
};
