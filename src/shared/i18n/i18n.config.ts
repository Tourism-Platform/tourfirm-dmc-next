import catalogPage from "../../../messages/en/catalog_page.json";
import common from "../../../messages/en/common.json";
import companyPage from "../../../messages/en/company_page.json";
import discoveryPage from "../../../messages/en/discovery_page.json";
import footer from "../../../messages/en/footer.json";
import header from "../../../messages/en/header.json";

import type { TNestedKeyOf } from "./types";

export type TCommon = typeof common;
export type THeader = typeof header;
export type TFooter = typeof footer;
export type TDiscoveryPage = typeof discoveryPage;
export type TCompanyPage = typeof companyPage;
export type TCatalogPage = typeof catalogPage;

export type TResources = {
	common: TCommon;
	header: THeader;
	footer: TFooter;
	discovery_page: TDiscoveryPage;
	company_page: TCompanyPage;
	catalog_page: TCatalogPage;
};

export const MESSAGE_NAMESPACES = [
	"common",
	"header",
	"footer",
	"discovery_page",
	"company_page",
	"catalog_page"
] as const;

export type TMessageNamespace = (typeof MESSAGE_NAMESPACES)[number];

export type TCommonKeys = TNestedKeyOf<TCommon>;
export type THeaderKeys = TNestedKeyOf<THeader>;
export type TFooterKeys = TNestedKeyOf<TFooter>;
export type TDiscoveryPageKeys = TNestedKeyOf<TDiscoveryPage>;
export type TCompanyPageKeys = TNestedKeyOf<TCompanyPage>;
export type TCatalogPageKeys = TNestedKeyOf<TCatalogPage>;
