import type { Block } from "payload";

import { actionFields } from "./action";

export const Hero: Block = {
	slug: "hero",
	fields: [
		{
			name: "image",
			type: "upload",
			relationTo: "media",
			required: true
		},
		{
			name: "imageAlt",
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
			type: "textarea",
			localized: true
		},
		{
			name: "note",
			type: "text",
			localized: true
		},
		{
			name: "actions",
			type: "array",
			fields: actionFields
		}
	]
};
