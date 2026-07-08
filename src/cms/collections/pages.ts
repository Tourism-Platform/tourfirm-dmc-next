import type { CollectionConfig } from "payload";

import { PAGE_PATH_GROUPS } from "@/shared/config/routes/page-path-groups";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { pageBlocks } from "../blocks";
import { seoField } from "../fields/seo";
import { statusField } from "../fields/status";
import { validatePageSlug } from "../hooks/validate-page-slug";
import { validatePageSlugUniqueness } from "../hooks/validate-page-slug-uniqueness";
import { hasSegmentRelation } from "../lib/slug-utils";

import { PAGE_DOMAIN_ADMIN } from "@/cms/admin/page-domain-admin.config";

const pageDomainListViews = {
	TeamPages: {
		path: PAGE_DOMAIN_ADMIN.team.viewPath,
		exact: true,
		Component: "@/cms/admin/domain-pages-list-view#TeamPagesListView"
	},
	LegalPages: {
		path: PAGE_DOMAIN_ADMIN.legal.viewPath,
		exact: true,
		Component: "@/cms/admin/domain-pages-list-view#LegalPagesListView"
	}
} as const;

export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "slug", "segment", "pathGroup"],
		components: {
			views: pageDomainListViews
		}
	},
	access: {
		read: authenticatedOrPublished
	},
	versions: {
		drafts: true
	},
	hooks: {
		beforeValidate: [validatePageSlugUniqueness]
	},
	fields: [
		{
			name: "segment",
			type: "relationship",
			relationTo: "segments"
		},
		{
			name: "pathGroup",
			type: "select",
			options: [...PAGE_PATH_GROUPS],
			admin: {
				description:
					"Optional URL namespace: /{segment}/{pathGroup}/{slug}. Empty = standard /{segment}/{slug}.",
				condition: (_, siblingData) =>
					hasSegmentRelation(siblingData ?? undefined)
			}
		},
		{
			name: "slug",
			type: "text",
			required: true,
			localized: true,
			index: true,
			validate: validatePageSlug
		},
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		seoField,
		{
			name: "blocks",
			type: "blocks",
			required: true,
			localized: true,
			blocks: pageBlocks
		},
		statusField
	]
};
