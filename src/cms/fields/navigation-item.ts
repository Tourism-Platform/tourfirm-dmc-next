import type { Field } from "payload";

import { navigationGroupItemFields } from "./navigation-group-item";

// Nav item order = navItems[] / columns[].items[] / group.groupItems[] array position only. Do not add order/index fields.

const whenType =
	(...types: string[]) =>
	(_: unknown, siblingData: Record<string, unknown>) =>
		types.includes(String(siblingData?.type));

export const navigationItemFields: Field[] = [
	{
		name: "type",
		type: "select",
		required: true,
		options: [
			{ label: "Page", value: "page" },
			{ label: "Group", value: "group" },
			{ label: "External", value: "external" },
			{ label: "Custom", value: "custom" }
		]
	},
	{
		name: "label",
		type: "text",
		localized: true,
		admin: {
			description:
				"Optional override. If empty, page title is used on the site."
		}
	},
	{
		name: "description",
		type: "text",
		localized: true,
		admin: {
			condition: whenType("page"),
			description:
				"Short text shown in header dropdown under the link title."
		}
	},
	{
		name: "icon",
		type: "text",
		admin: {
			description: "Lucide icon name, e.g. mail, shield, handshake"
		}
	},
	{
		name: "target",
		type: "select",
		defaultValue: "_self",
		options: [
			{ label: "Same tab", value: "_self" },
			{ label: "New tab", value: "_blank" }
		],
		admin: {
			condition: whenType("page", "external", "custom")
		}
	},
	{
		name: "page",
		type: "relationship",
		relationTo: "pages",
		admin: {
			condition: whenType("page")
		}
	},
	{
		name: "href",
		type: "text",
		admin: {
			condition: whenType("external", "custom")
		}
	},
	{
		name: "groupItems",
		type: "array",
		admin: {
			condition: whenType("group"),
			description:
				"Named groupItems (not items) to avoid Drizzle relation clash in footer columns.",
			components: {
				RowLabel:
					"@/cms/admin/navigation-item-row-label#NavigationItemRowLabel"
			}
		},
		fields: navigationGroupItemFields
	}
];
