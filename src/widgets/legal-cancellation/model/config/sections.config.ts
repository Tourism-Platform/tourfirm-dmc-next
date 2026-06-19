import type { TLegalDocumentContentSection } from "@/widgets/legal-document";

export const CANCELLATION_CONTENT_SECTIONS: TLegalDocumentContentSection[] = [
	{
		type: "paragraphs",
		title: "sections.booking_terms_first.title",
		paragraphs: [
			"sections.booking_terms_first.paragraphs.p1",
			"sections.booking_terms_first.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.before_confirmation.title",
		paragraphs: ["sections.before_confirmation.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.after_confirmation.title",
		paragraphs: [
			"sections.after_confirmation.paragraphs.p1",
			"sections.after_confirmation.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.client_changes.title",
		paragraphs: ["sections.client_changes.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.no_show.title",
		paragraphs: [
			"sections.no_show.paragraphs.p1",
			"sections.no_show.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.tourlink_cancellation.title",
		paragraphs: [
			"sections.tourlink_cancellation.paragraphs.p1",
			"sections.tourlink_cancellation.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.emergency.title",
		paragraphs: ["sections.emergency.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.refunds.title",
		paragraphs: ["sections.refunds.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.how_to_cancel.title",
		paragraphs: ["sections.how_to_cancel.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.contacts.title",
		paragraphs: ["sections.contacts.paragraphs.p1"]
	}
];
