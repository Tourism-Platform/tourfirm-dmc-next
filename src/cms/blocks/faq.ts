import type { Block } from "payload";

import { questionFields } from "./question";

// Question order = block.questions[] array position only. Do not add order/index fields.
export const Faq: Block = {
	slug: "faq",
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
			name: "questions",
			type: "array",
			label: "Questions",
			fields: questionFields
		}
	]
};
