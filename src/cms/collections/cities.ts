import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import {
	revalidateDestinationsNavAfterChange,
	revalidateDestinationsNavAfterDelete
} from "../hooks/revalidate-destinations-nav";
import { validateCityHierarchy } from "../hooks/validate-geo-hierarchy";

export const Cities: CollectionConfig = {
	slug: "cities",
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
		beforeValidate: [validateCityHierarchy],
		afterChange: [revalidateDestinationsNavAfterChange],
		afterDelete: [revalidateDestinationsNavAfterDelete]
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
			name: "region",
			type: "relationship",
			relationTo: "regions",
			required: true,
			filterOptions: ({ data }) => {
				if (data?.country) {
					return {
						country: {
							equals: data.country
						}
					};
				}

				return true;
			}
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
			name: "attractions",
			type: "join",
			collection: "attractions",
			on: "city"
		},
		{
			name: "experiences",
			type: "join",
			collection: "experiences",
			on: "city"
		},
		{
			name: "relatedRoutes",
			type: "join",
			collection: "routes",
			on: "cities"
		}
	]
};
