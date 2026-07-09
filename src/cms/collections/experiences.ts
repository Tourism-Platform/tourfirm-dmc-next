import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import {
	revalidateExperiencesNavAfterChange,
	revalidateExperiencesNavAfterDelete
} from "../hooks/revalidate-discovery-nav";
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
		beforeValidate: [validateExperienceHierarchy],
		afterChange: [revalidateExperiencesNavAfterChange],
		afterDelete: [revalidateExperiencesNavAfterDelete]
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
			name: "relatedExperiences",
			type: "relationship",
			relationTo: "experiences",
			hasMany: true,
			admin: {
				description:
					"Manually curated similar experiences shown on the detail page."
			}
		},
		{
			name: "featured",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description: "Show in featured strips (homepage, hub)."
			}
		},
		{
			name: "sortOrder",
			type: "number",
			defaultValue: 0,
			admin: {
				description: "Listing order. Lower values appear first."
			}
		},
		{
			name: "catalogQuery",
			type: "text",
			admin: {
				description:
					"Query string for the commercial catalog CTA, e.g. destination=Uzbekistan."
			}
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
