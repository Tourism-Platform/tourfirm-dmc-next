import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { buildLocaleAvailabilityFields } from "../fields/locale-availability-fields";
import { localizedText } from "../fields/ui-content/localized-text";
import { revalidateUiCommonCache } from "../hooks/revalidate-layout-cms";

export const UiCommon: GlobalConfig = {
	slug: "ui-common",
	label: "Common",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiCommonCache]
	},
	fields: [
		{
			name: "localeAvailability",
			type: "group",
			label: "Locale Availability",
			fields: buildLocaleAvailabilityFields()
		},
		{
			name: "meta",
			type: "group",
			fields: [localizedText("title"), localizedText("description")]
		},
		{
			name: "actions",
			type: "group",
			fields: [localizedText("showMore")]
		},
		{
			name: "uploadFiles",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("empty"),
				localizedText("description"),
				localizedText("uploaded"),
				{
					name: "buttons",
					type: "group",
					fields: [
						localizedText("add"),
						localizedText("remove"),
						localizedText("select")
					]
				}
			]
		},
		{
			name: "table",
			type: "group",
			fields: [
				localizedText("search"),
				localizedText("status"),
				localizedText("pagination"),
				{
					name: "view",
					type: "group",
					fields: [localizedText("title"), localizedText("toggle")]
				},
				{
					name: "emptyState",
					type: "group",
					fields: [
						localizedText("title"),
						localizedText("description")
					]
				}
			]
		},
		{
			name: "datePicker",
			type: "group",
			fields: [
				localizedText("placeholder"),
				{
					name: "buttons",
					type: "group",
					fields: [localizedText("apply"), localizedText("reset")]
				}
			]
		},
		{
			name: "uploadImages",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("description"),
				localizedText("uploaded"),
				localizedText("total"),
				localizedText("formats"),
				{
					name: "buttons",
					type: "group",
					fields: [
						localizedText("add"),
						localizedText("clear"),
						localizedText("select")
					]
				}
			]
		},
		{
			name: "uploadMainImage",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("description"),
				localizedText("formats"),
				{
					name: "errors",
					type: "group",
					fields: [localizedText("title"), localizedText("remove")]
				}
			]
		},
		{
			name: "multiselect",
			type: "group",
			fields: [localizedText("selected")]
		},
		{
			name: "filters",
			type: "group",
			fields: [
				{
					name: "price",
					type: "group",
					fields: [localizedText("from"), localizedText("to")]
				}
			]
		},
		{
			name: "themeToggle",
			type: "group",
			fields: [
				localizedText("light"),
				localizedText("dark"),
				localizedText("system")
			]
		},
		{
			name: "languageToggle",
			type: "group",
			fields: [
				localizedText("en"),
				localizedText("ru"),
				localizedText("uz")
			]
		}
	]
};
