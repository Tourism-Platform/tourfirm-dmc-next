import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { localizedText } from "../fields/ui-content/localized-text";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

export const UiCatalog: GlobalConfig = {
	slug: "ui-catalog",
	label: "Catalog",
	access: {
		read: authenticatedOrPublished
	},
	hooks: {
		afterChange: [revalidateUiContentCache]
	},
	fields: [
		{
			name: "meta",
			type: "group",
			fields: [localizedText("title"), localizedText("description")]
		},
		{
			name: "header",
			type: "group",
			fields: [localizedText("found")]
		},
		{
			name: "filters",
			type: "group",
			fields: [
				localizedText("title"),
				{
					name: "fields",
					type: "group",
					fields: [
						localizedText("price"),
						localizedText("region"),
						localizedText("duration"),
						localizedText("language"),
						localizedText("category")
					]
				},
				{
					name: "durations",
					type: "group",
					fields: [
						localizedText("halfDay"),
						localizedText("fullDay"),
						localizedText("multiDays")
					]
				},
				{
					name: "buttons",
					type: "group",
					fields: [localizedText("reset")]
				}
			]
		},
		{
			name: "toasts",
			type: "group",
			fields: [localizedText("loadError")]
		},
		{
			name: "alert",
			type: "group",
			fields: [localizedText("title"), localizedText("description")]
		},
		{
			name: "popularTours",
			type: "group",
			fields: [localizedText("title")]
		},
		{
			name: "pagination",
			type: "group",
			fields: [
				localizedText("prev"),
				localizedText("next"),
				localizedText("page")
			]
		}
	]
};
