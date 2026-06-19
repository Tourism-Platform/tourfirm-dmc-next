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
		}
	]
};
