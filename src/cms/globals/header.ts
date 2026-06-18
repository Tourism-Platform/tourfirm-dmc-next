import type { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
	slug: "header",
	fields: [
		{
			name: "logo",
			type: "upload",
			relationTo: "media"
		},
		{
			name: "navItems",
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
		},
		{
			name: "ctaAction",
			type: "group",
			fields: [
				{
					name: "type",
					type: "select",
					options: [
						{ label: "Mailto", value: "mailto" },
						{ label: "Link", value: "link" }
					]
				},
				{
					name: "href",
					type: "text"
				},
				{
					name: "title",
					type: "text",
					localized: true
				},
				{
					name: "variant",
					type: "select",
					options: [
						{ label: "Default", value: "default" },
						{ label: "Destructive", value: "destructive" },
						{ label: "Outline", value: "outline" },
						{ label: "Secondary", value: "secondary" },
						{ label: "Ghost", value: "ghost" },
						{ label: "Link", value: "link" }
					]
				}
			]
		}
	]
};
