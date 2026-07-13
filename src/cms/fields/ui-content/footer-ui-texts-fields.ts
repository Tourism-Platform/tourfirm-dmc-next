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
				fields: [localizedText("name")]
			},
			localizedText("comingSoon"),
			localizedText("copyright")
		]
	}
];
