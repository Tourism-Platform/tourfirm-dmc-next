import type { TPrivacyContentSection } from "../types/sections.types";

export const PRIVACY_CONTENT_SECTIONS: TPrivacyContentSection[] = [
	{
		type: "paragraphs",
		title: "sections.who_we.title",
		paragraphs: ["sections.who_we.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.scope.title",
		paragraphs: [
			"sections.scope.paragraphs.p1",
			"sections.scope.paragraphs.p2"
		]
	},
	{
		type: "list",
		title: "sections.data_collected.title",
		items: [
			"sections.data_collected.items.contact",
			"sections.data_collected.items.request",
			"sections.data_collected.items.booking",
			"sections.data_collected.items.communication",
			"sections.data_collected.items.technical"
		]
	},
	{
		type: "paragraphs",
		title: "sections.data_use.title",
		paragraphs: [
			"sections.data_use.paragraphs.p1",
			"sections.data_use.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.data_sharing.title",
		paragraphs: [
			"sections.data_sharing.paragraphs.p1",
			"sections.data_sharing.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.cross_border.title",
		paragraphs: ["sections.cross_border.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.retention.title",
		paragraphs: ["sections.retention.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.rights.title",
		paragraphs: [
			"sections.rights.paragraphs.p1",
			"sections.rights.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.cookies.title",
		paragraphs: ["sections.cookies.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.security.title",
		paragraphs: ["sections.security.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.changes.title",
		paragraphs: ["sections.changes.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.contacts.title",
		paragraphs: ["sections.contacts.paragraphs.p1"]
	}
];
