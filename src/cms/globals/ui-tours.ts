import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { localizedText } from "../fields/ui-content/localized-text";
import { revalidateUiContentCache } from "../hooks/revalidate-layout-cms";

export const UiTours: GlobalConfig = {
	slug: "ui-tours",
	label: "Tours",
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
			name: "hero",
			type: "group",
			fields: [localizedText("title")]
		},
		{
			name: "search",
			type: "group",
			fields: [
				{
					name: "where",
					type: "group",
					fields: [
						localizedText("label"),
						localizedText("placeholder"),
						localizedText("empty"),
						localizedText("required")
					]
				},
				{
					name: "when",
					type: "group",
					fields: [
						localizedText("label"),
						localizedText("placeholder")
					]
				},
				localizedText("submit")
			]
		},
		{
			name: "recent",
			type: "group",
			fields: [
				localizedText("title"),
				{
					name: "tourType",
					type: "group",
					fields: [localizedText("group"), localizedText("private")]
				}
			]
		},
		{
			name: "popular",
			type: "group",
			fields: [localizedText("title")]
		},
		{
			name: "blog",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("readMore"),
				localizedText("viewAll")
			]
		},
		{
			name: "offers",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("subtitle"),
				localizedText("cta")
			]
		},
		{
			name: "destinations",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("count"),
				localizedText("viewAll")
			]
		},
		{
			name: "card",
			type: "group",
			fields: [
				localizedText("recommended"),
				localizedText("reviews"),
				localizedText("durationDays"),
				localizedText("freeCancellation"),
				localizedText("priceFrom"),
				localizedText("bookNow"),
				localizedText("duration"),
				localizedText("group"),
				localizedText("age"),
				localizedText("options")
			]
		},
		{
			name: "toasts",
			type: "group",
			fields: [localizedText("loadError")]
		}
	]
};
