import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { localizedText } from "../fields/ui-content/localized-text";

const paginationFields = [
	localizedText("paginationPrev"),
	localizedText("paginationNext")
];

export const UiDiscovery: GlobalConfig = {
	slug: "ui-discovery",
	label: "Discovery",
	access: {
		read: authenticatedOrPublished
	},
	fields: [
		localizedText("geoBreadcrumbLabel"),
		localizedText("paginationAriaLabel"),
		{
			name: "blog",
			type: "group",
			fields: paginationFields
		},
		{
			name: "routes",
			type: "group",
			fields: paginationFields
		},
		{
			name: "experiences",
			type: "group",
			fields: paginationFields
		},
		{
			name: "news",
			type: "group",
			fields: paginationFields
		},
		{
			name: "tradeFairs",
			type: "group",
			fields: paginationFields
		}
	]
};
