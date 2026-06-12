import type { TLegalPrivacyPageKeys } from "@/shared/i18n";

export type TPrivacyParagraphsSection = {
	type: "paragraphs";
	title: TLegalPrivacyPageKeys;
	paragraphs: TLegalPrivacyPageKeys[];
};

export type TPrivacyListSection = {
	type: "list";
	title: TLegalPrivacyPageKeys;
	items: TLegalPrivacyPageKeys[];
};

export type TPrivacyContentSection =
	| TPrivacyParagraphsSection
	| TPrivacyListSection;
