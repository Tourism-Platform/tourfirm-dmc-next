import type { CollectionConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { statusField } from "../fields/status";
import { preventDeleteSegmentWithPages } from "../hooks/prevent-delete-segment-with-pages";
import { validateSegmentSlug } from "../hooks/validate-segment-slug";
import { validateSegmentSlugNotDestination } from "../hooks/validate-segment-slug-not-destination";

export const Segments: CollectionConfig = {
	slug: "segments",
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
		beforeValidate: [validateSegmentSlugNotDestination],
		beforeDelete: [preventDeleteSegmentWithPages]
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			index: true,
			validate: validateSegmentSlug
		},
		{
			name: "description",
			type: "textarea",
			localized: true
		},
		{
			name: "pages",
			type: "join",
			collection: "pages",
			on: "segment"
		},
		statusField
	]
};
