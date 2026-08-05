import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { navigationItemFields } from "../fields/navigation-item";
import { headerUiTextsFields } from "../fields/ui-content/header-ui-texts-fields";
import { localizedText } from "../fields/ui-content/localized-text";

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
			name: "informationAreas",
			type: "array",
			labels: {
				singular: "Area",
				plural: "Information areas"
			},
			admin: {
				description:
					"Parents for Information mega and footer columns. Children auto-load from each collection."
			},
			fields: [
				{
					name: "collection",
					type: "select",
					required: true,
					options: [
						{ label: "News", value: "news" },
						{ label: "Blog", value: "blog" },
						{ label: "Trade fairs", value: "trade-fairs" }
					]
				},
				{
					name: "label",
					type: "text",
					localized: true,
					admin: {
						description:
							"Optional override. Defaults to News / Blog / Trade fairs."
					}
				}
			]
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
		{
			name: "userMenuItems",
			type: "array",
			labels: {
				singular: "Menu item",
				plural: "User menu items"
			},
			admin: {
				description:
					"Authenticated user dropdown links. Order = display order.",
				components: {
					RowLabel:
						"@/cms/admin/user-menu-item-row-label#UserMenuItemRowLabel"
				}
			},
			fields: [
				localizedText("title"),
				{
					name: "href",
					type: "text",
					required: true,
					admin: {
						description: "Internal path, e.g. /booking"
					}
				},
				{
					name: "icon",
					type: "text",
					admin: {
						description: "Lucide icon name, optional"
					}
				}
			]
		},
		...headerUiTextsFields
	]
};
