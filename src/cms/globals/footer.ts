import type { GlobalConfig } from "payload";

import { socialPlatformSelectOptions } from "@/shared/config/social-platforms";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { navigationItemFields } from "../fields/navigation-item";
import { footerUiTextsFields } from "../fields/ui-content/footer-ui-texts-fields";
import { revalidateFooterCache } from "../hooks/revalidate-layout-cms";

export const Footer: GlobalConfig = {
	slug: "footer",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateFooterCache]
	},
	fields: [
		{
			name: "columns",
			type: "array",
			admin: {
				components: {
					RowLabel:
						"@/cms/admin/footer-column-row-label#FooterColumnRowLabel"
				}
			},
			fields: [
				{
					name: "title",
					type: "text",
					required: true,
					localized: true
				},
				{
					name: "items",
					type: "array",
					admin: {
						components: {
							RowLabel:
								"@/cms/admin/navigation-item-row-label#NavigationItemRowLabel"
						}
					},
					fields: navigationItemFields
				}
			]
		},
		{
			name: "socialLinks",
			type: "array",
			fields: [
				{
					name: "platform",
					type: "select",
					required: true,
					options: socialPlatformSelectOptions
				},
				{
					name: "url",
					type: "text",
					required: true
				},
				{
					name: "showInFooter",
					type: "checkbox",
					defaultValue: true,
					label: "Show in footer"
				}
			]
		},
		{
			name: "copyrightText",
			type: "text",
			localized: true
		},
		...footerUiTextsFields
	]
};
