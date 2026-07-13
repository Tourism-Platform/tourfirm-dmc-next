import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { navigationItemFields } from "../fields/navigation-item";
import { headerUiTextsFields } from "../fields/ui-content/header-ui-texts-fields";

export const Header: GlobalConfig = {
	slug: "header",
	access: {
		read: authenticatedOrPublished
	},
	fields: [
		{
			name: "logo",
			type: "upload",
			relationTo: "media"
		},
		{
			name: "navItems",
			type: "array",
			admin: {
				components: {
					RowLabel:
						"@/cms/admin/navigation-item-row-label#NavigationItemRowLabel"
				}
			},
			fields: navigationItemFields
		},
		{
			name: "ctaAction",
			type: "group",
			fields: [
				{
					name: "type",
					type: "select",
					options: [
						{ label: "Mailto", value: "mailto" },
						{ label: "Link", value: "link" }
					]
				},
				{
					name: "href",
					type: "text"
				},
				{
					name: "title",
					type: "text",
					localized: true
				},
				{
					name: "variant",
					type: "select",
					options: [
						{ label: "Default", value: "default" },
						{ label: "Destructive", value: "destructive" },
						{ label: "Outline", value: "outline" },
						{ label: "Secondary", value: "secondary" },
						{ label: "Ghost", value: "ghost" },
						{ label: "Link", value: "link" }
					]
				}
			]
		},
		...headerUiTextsFields
	]
};
