import type { Block } from "payload";

import { actionFields } from "./action";

export const Cta: Block = {
	slug: "cta",
	fields: [
		{
			name: "image",
			type: "upload",
			relationTo: "media"
		},
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
			type: "textarea",
			localized: true
		},
		{
			name: "actions",
			type: "array",
			fields: actionFields
		}
	]
};
