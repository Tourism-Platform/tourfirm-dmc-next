import type { Field } from "payload";

import { localizedText } from "./localized-text";

export const footerUiTextsFields: Field[] = [
	{
		name: "uiTexts",
		type: "group",
		label: "UI Texts",
		fields: [
			{
				name: "brand",
				type: "group",
				fields: [localizedText("name"), localizedText("tagline")]
			},
			{
				name: "community",
				type: "group",
				fields: [localizedText("title"), localizedText("subtitle")]
			},
			localizedText("comingSoon"),
			localizedText("copyright")
		]
	}
];
