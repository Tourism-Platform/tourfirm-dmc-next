import type { TLegalDocumentContentSection } from "@/widgets/legal-document";

export const BOOKING_CONTENT_SECTIONS: TLegalDocumentContentSection[] = [
	{
		type: "paragraphs",
		title: "sections.scope.title",
		paragraphs: [
			"sections.scope.paragraphs.p1",
			"sections.scope.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.request_confirmation.title",
		paragraphs: ["sections.request_confirmation.paragraphs.p1"]
	},
	{
		type: "list",
		title: "sections.booking_process.title",
		items: [
			"sections.booking_process.items.step1",
			"sections.booking_process.items.step2",
			"sections.booking_process.items.step3",
			"sections.booking_process.items.step4",
			"sections.booking_process.items.step5",
			"sections.booking_process.items.step6"
		]
	},
	{
		type: "paragraphs",
		title: "sections.pricing.title",
		paragraphs: [
			"sections.pricing.paragraphs.p1",
			"sections.pricing.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.payment.title",
		paragraphs: [
			"sections.payment.paragraphs.p1",
			"sections.payment.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.traveller_data.title",
		paragraphs: ["sections.traveller_data.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.documents.title",
		paragraphs: [
			"sections.documents.paragraphs.p1",
			"sections.documents.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.health.title",
		paragraphs: [
			"sections.health.paragraphs.p1",
			"sections.health.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.changes.title",
		paragraphs: [
			"sections.changes.paragraphs.p1",
			"sections.changes.paragraphs.p2"
		]
	},
	{
		type: "paragraphs",
		title: "sections.during_trip.title",
		paragraphs: ["sections.during_trip.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.service_issues.title",
		paragraphs: ["sections.service_issues.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.cancellation.title",
		paragraphs: ["sections.cancellation.paragraphs.p1"]
	},
	{
		type: "paragraphs",
		title: "sections.contacts.title",
		paragraphs: ["sections.contacts.paragraphs.p1"]
	}
];
