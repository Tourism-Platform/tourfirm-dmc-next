import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { navigationItemFields } from "../fields/navigation-item";
import { footerUiTextsFields } from "../fields/ui-content/footer-ui-texts-fields";

export const Footer: GlobalConfig = {
	slug: "footer",
	access: {
		read: authenticatedOrPublished
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
					type: "text",
					required: true
				},
				{
					name: "url",
					type: "text",
					required: true
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
