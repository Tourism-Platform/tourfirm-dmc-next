import type { Block } from "payload";

import { actionFields } from "./action";
import { cardFields } from "./card";

export const Regular: Block = {
	slug: "regular",
	fields: [
		{
			name: "eyebrow",
			type: "text",
			localized: true
		},
		{
			name: "title",
			type: "text",
			required: true,
			localized: true
		},
		{
			name: "description",
			type: "richText",
			localized: true
		},
		{
			name: "gridClassName",
			type: "text"
		},
		{
			name: "actions",
			type: "array",
			fields: actionFields
		},
		{
			name: "cards",
			type: "array",
			fields: cardFields
		},
		{
			name: "cardsSource",
			type: "group",
			fields: [
				{
					name: "type",
					type: "select",
					defaultValue: "static",
					options: [
						{ label: "Static cards", value: "static" },
						{ label: "Document field", value: "documentField" },
						{ label: "Collection query", value: "collection" }
					]
				},
				{
					name: "field",
					type: "text",
					admin: {
						condition: (_, siblingData) =>
							siblingData?.type === "documentField"
					}
				},
				{
					name: "collection",
					type: "text",
					admin: {
						condition: (_, siblingData) =>
							siblingData?.type === "collection"
					}
				},
				{
					name: "emptyLabel",
					type: "text",
					localized: true,
					admin: {
						condition: (_, siblingData) =>
							siblingData?.type === "collection"
					}
				}
			]
		}
	]
};
