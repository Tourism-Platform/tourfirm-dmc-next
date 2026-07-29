import type { Field } from "payload";

import { localizedText } from "./localized-text";

const columnPairFields: Field[] = [
	localizedText("title"),
	localizedText("subtitle")
];

export const headerUiTextsFields: Field[] = [
	{
		name: "uiTexts",
		type: "group",
		label: "UI Texts",
		fields: [
			{
				name: "public",
				type: "group",
				fields: [
					{
						name: "nav",
						type: "group",
						fields: [
							{
								name: "destinations",
								type: "group",
								fields: [
									localizedText("label"),
									localizedText("viewAll"),
									{
										name: "columns",
										type: "group",
										fields: [
											{
												name: "countries",
												type: "group",
												fields: columnPairFields
											},
											{
												name: "regions",
												type: "group",
												fields: columnPairFields
											},
											{
												name: "cities",
												type: "group",
												fields: columnPairFields
											}
										]
									}
								]
							},
							{
								name: "routes",
								type: "group",
								fields: [
									{
										name: "columns",
										type: "group",
										fields: [localizedText("title")]
									},
									localizedText("viewAll")
								]
							},
							{
								name: "experiences",
								type: "group",
								fields: [
									{
										name: "columns",
										type: "group",
										fields: [localizedText("title")]
									},
									localizedText("viewAll")
								]
							},
							{
								name: "information",
								type: "group",
								fields: [
									localizedText("areasLabel"),
									localizedText("viewAll")
								]
							},
							localizedText("mobileMenu"),
							localizedText("comingSoon")
						]
					}
				]
			}
		]
	}
];
