import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
	slug: "footer",
	fields: [
		{
			name: "columns",
			type: "array",
			fields: [
				{
					name: "title",
					type: "text",
					required: true,
					localized: true
				},
				{
					name: "links",
					type: "array",
					fields: [
						{
							name: "label",
							type: "text",
							required: true,
							localized: true
						},
						{
							name: "href",
							type: "text",
							required: true
						}
					]
				}
			]
		},
		{
			name: "socialLinks",
			type: "array",
			fields: [
				{
					name: "platform",
					type: "text",
					required: true
				},
				{
					name: "url",
					type: "text",
					required: true
				}
			]
		},
		{
			name: "copyrightText",
			type: "text",
			localized: true
		}
	]
};
