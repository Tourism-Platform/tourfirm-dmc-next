export type TLegalDocumentParagraphsSection = {
	type: "paragraphs";
	title: string;
	paragraphs: string[];
};

export type TLegalDocumentListSection = {
	type: "list";
	title: string;
	items: string[];
};

export type TLegalDocumentContentSection =
	| TLegalDocumentParagraphsSection
	| TLegalDocumentListSection;
