import type { Field } from "payload";

export const actionFields: Field[] = [
	{
		name: "type",
		type: "select",
		required: true,
		options: [
			{ label: "Mailto", value: "mailto" },
			{ label: "Link", value: "link" },
			{ label: "Tel", value: "tel" }
		]
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
	},
	{
		name: "title",
		type: "text",
		required: true,
		localized: true
	},
	{
		name: "href",
		type: "text",
		admin: {
			condition: (_, siblingData) => siblingData?.type === "link"
		}
	},
	{
		name: "email",
		type: "text",
		admin: {
			condition: (_, siblingData) => siblingData?.type === "mailto"
		}
	},
	{
		name: "phone",
		type: "text",
		admin: {
			condition: (_, siblingData) => siblingData?.type === "tel"
		}
	},
	{
		name: "target",
		type: "select",
		options: [
			{ label: "Same tab", value: "_self" },
			{ label: "New tab", value: "_blank" }
		],
		admin: {
			condition: (_, siblingData) => siblingData?.type === "link"
		}
	}
];
