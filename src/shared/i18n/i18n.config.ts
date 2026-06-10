import catalogPage from "../../../messages/en/catalog_page.json";
import common from "../../../messages/en/common.json";
import companyAboutPage from "../../../messages/en/company_about_page.json";
import companyFeedbackPage from "../../../messages/en/company_feedback_page.json";
import companyNewsPage from "../../../messages/en/company_news_page.json";
import companyPartnershipPage from "../../../messages/en/company_partnership_page.json";
import companyServicesPage from "../../../messages/en/company_services_page.json";
import destinationsPage from "../../../messages/en/destinations_page.json";
import footer from "../../../messages/en/footer.json";
import header from "../../../messages/en/header.json";
import helpContactPage from "../../../messages/en/help_contact_page.json";
import helpFaqPage from "../../../messages/en/help_faq_page.json";
import helpMoreInfoPage from "../../../messages/en/help_more_info_page.json";
import helpSupportPage from "../../../messages/en/help_support_page.json";
import helpTrainingPage from "../../../messages/en/help_training_page.json";
import legalPrivacyPage from "../../../messages/en/legal_privacy_page.json";
import legalTermsPage from "../../../messages/en/legal_terms_page.json";
import mainPage from "../../../messages/en/main_page.json";
import partnersAgenciesPage from "../../../messages/en/partners_agencies_page.json";
import partnersHotelsPage from "../../../messages/en/partners_hotels_page.json";

import type { TNestedKeyOf } from "./types";

export type TCommon = typeof common;
export type THeader = typeof header;
export type TFooter = typeof footer;
export type TMainPage = typeof mainPage;
export type TDestinationsPage = typeof destinationsPage;
export type TCatalogPage = typeof catalogPage;
export type TPartnersAgenciesPage = typeof partnersAgenciesPage;
export type TPartnersHotelsPage = typeof partnersHotelsPage;
export type TCompanyAboutPage = typeof companyAboutPage;
export type TCompanyServicesPage = typeof companyServicesPage;
export type TCompanyPartnershipPage = typeof companyPartnershipPage;
export type TCompanyNewsPage = typeof companyNewsPage;
export type TCompanyFeedbackPage = typeof companyFeedbackPage;
export type TLegalTermsPage = typeof legalTermsPage;
export type TLegalPrivacyPage = typeof legalPrivacyPage;
export type THelpSupportPage = typeof helpSupportPage;
export type THelpContactPage = typeof helpContactPage;
export type THelpFaqPage = typeof helpFaqPage;
export type THelpTrainingPage = typeof helpTrainingPage;
export type THelpMoreInfoPage = typeof helpMoreInfoPage;

export type TResources = {
	common: TCommon;
	header: THeader;
	footer: TFooter;
	main_page: TMainPage;
	destinations_page: TDestinationsPage;
	catalog_page: TCatalogPage;
	partners_agencies_page: TPartnersAgenciesPage;
	partners_hotels_page: TPartnersHotelsPage;
	company_about_page: TCompanyAboutPage;
	company_services_page: TCompanyServicesPage;
	company_partnership_page: TCompanyPartnershipPage;
	company_news_page: TCompanyNewsPage;
	company_feedback_page: TCompanyFeedbackPage;
	legal_terms_page: TLegalTermsPage;
	legal_privacy_page: TLegalPrivacyPage;
	help_support_page: THelpSupportPage;
	help_contact_page: THelpContactPage;
	help_faq_page: THelpFaqPage;
	help_training_page: THelpTrainingPage;
	help_more_info_page: THelpMoreInfoPage;
};

export const MESSAGE_NAMESPACES = [
	"common",
	"header",
	"footer",
	"main_page",
	"destinations_page",
	"catalog_page",
	"partners_agencies_page",
	"partners_hotels_page",
	"company_about_page",
	"company_services_page",
	"company_partnership_page",
	"company_news_page",
	"company_feedback_page",
	"legal_terms_page",
	"legal_privacy_page",
	"help_support_page",
	"help_contact_page",
	"help_faq_page",
	"help_training_page",
	"help_more_info_page"
] as const;

export type TMessageNamespace = (typeof MESSAGE_NAMESPACES)[number];

export type TCommonKeys = TNestedKeyOf<TCommon>;
export type THeaderKeys = TNestedKeyOf<THeader>;
export type TFooterKeys = TNestedKeyOf<TFooter>;
export type TMainPageKeys = TNestedKeyOf<TMainPage>;
export type TDestinationsPageKeys = TNestedKeyOf<TDestinationsPage>;
export type TCatalogPageKeys = TNestedKeyOf<TCatalogPage>;
export type TPartnersAgenciesPageKeys = TNestedKeyOf<TPartnersAgenciesPage>;
export type TPartnersHotelsPageKeys = TNestedKeyOf<TPartnersHotelsPage>;
export type TCompanyAboutPageKeys = TNestedKeyOf<TCompanyAboutPage>;
export type TCompanyServicesPageKeys = TNestedKeyOf<TCompanyServicesPage>;
export type TCompanyPartnershipPageKeys = TNestedKeyOf<TCompanyPartnershipPage>;
export type TCompanyNewsPageKeys = TNestedKeyOf<TCompanyNewsPage>;
export type TCompanyFeedbackPageKeys = TNestedKeyOf<TCompanyFeedbackPage>;
export type TLegalTermsPageKeys = TNestedKeyOf<TLegalTermsPage>;
export type TLegalPrivacyPageKeys = TNestedKeyOf<TLegalPrivacyPage>;
export type THelpSupportPageKeys = TNestedKeyOf<THelpSupportPage>;
export type THelpContactPageKeys = TNestedKeyOf<THelpContactPage>;
export type THelpFaqPageKeys = TNestedKeyOf<THelpFaqPage>;
export type THelpTrainingPageKeys = TNestedKeyOf<THelpTrainingPage>;
export type THelpMoreInfoPageKeys = TNestedKeyOf<THelpMoreInfoPage>;
