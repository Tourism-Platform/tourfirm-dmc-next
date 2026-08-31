import type { Block } from "payload";

import { actionFields } from "./action";
import { tagsField, toneField } from "./block-shared-fields";
import { cardFields } from "./card";

const columnRatioOptions = [
	{ label: "1 : 1", value: "1:1" },
	{ label: "1 : 2", value: "1:2" },
	{ label: "2 : 1", value: "2:1" },
	{ label: "1 : 3", value: "1:3" },
	{ label: "3 : 1", value: "3:1" },
	{ label: "2 : 3", value: "2:3" },
	{ label: "3 : 2", value: "3:2" },
	{ label: "1 : 4", value: "1:4" },
	{ label: "4 : 1", value: "4:1" },
	{ label: "3 : 4", value: "3:4" },
	{ label: "4 : 3", value: "4:3" },
	{ label: "1 : 5", value: "1:5" },
	{ label: "5 : 1", value: "5:1" },
	{ label: "2 : 5", value: "2:5" },
	{ label: "5 : 2", value: "5:2" },
	{ label: "3 : 5", value: "3:5" },
	{ label: "5 : 3", value: "5:3" },
	{ label: "4 : 5", value: "4:5" },
	{ label: "5 : 4", value: "5:4" }
] as const;

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
			localized: true
		},
		{
			name: "description",
			type: "richText",
			localized: true
		},
		toneField,
		tagsField,
		{
			name: "gridClassName",
			type: "text"
		},
		{
			name: "displayMode",
			type: "select",
			defaultValue: "grid",
			options: [
				{ label: "Grid", value: "grid" },
				{ label: "Carousel", value: "carousel" },
				{ label: "Mosaic", value: "mosaic" }
			]
		},
		{
			name: "actions",
			type: "array",
			fields: actionFields
		},
		{
			name: "rows",
			type: "array",
			labels: {
				singular: "Content Row",
				plural: "Content Rows"
			},
			fields: [
				{
					name: "ratio",
					type: "select",
					defaultValue: "2:1",
					options: [...columnRatioOptions],
					admin: {
						description:
							"Left:Right ratio when both columns have content. Ignored if one column is empty."
					}
				},
				{
					name: "left",
					type: "array",
					labels: {
						singular: "Left card",
						plural: "Left column"
					},
					fields: cardFields
				},
				{
					name: "right",
					type: "array",
					labels: {
						singular: "Right card",
						plural: "Right column"
					},
					fields: cardFields
				}
			]
		},
		{
			name: "cards",
			type: "array",
			admin: {
				description:
					"Legacy flat card grid. Used when Content Rows are empty."
			},
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
