import type { GlobalConfig } from "payload";

import { navigationItemFields } from "../fields/navigation-item";

export const Footer: GlobalConfig = {
	slug: "footer",
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
		}
	]
};
