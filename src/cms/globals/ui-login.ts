import type { GlobalConfig } from "payload";

import { authenticatedOrPublished } from "../access/authenticated-or-published";
import { localizedText } from "../fields/ui-content/localized-text";

export const UiLogin: GlobalConfig = {
	slug: "ui-login",
	label: "Login",
	access: {
		read: authenticatedOrPublished
	},
	fields: [
		{
			name: "meta",
			type: "group",
			fields: [localizedText("title"), localizedText("description")]
		},
		{
			name: "form",
			type: "group",
			fields: [
				localizedText("title"),
				localizedText("description"),
				localizedText("googleButton"),
				localizedText("trustNote")
			]
		},
		{
			name: "sidePanel",
			type: "group",
			label: "Side panel",
			fields: [
				localizedText("brandLabel"),
				localizedText("title"),
				localizedText("subtitle"),
				localizedText("quote")
			]
		}
	]
};
