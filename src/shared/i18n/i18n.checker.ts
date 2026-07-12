import catalogPageRu from "../../../messages/ru/catalog_page.json";
import commonRu from "../../../messages/ru/common.json";
import companyPageRu from "../../../messages/ru/company_page.json";
import discoveryPageRu from "../../../messages/ru/discovery_page.json";
import footerRu from "../../../messages/ru/footer.json";
import headerRu from "../../../messages/ru/header.json";
import catalogPageUz from "../../../messages/uz/catalog_page.json";
import commonUz from "../../../messages/uz/common.json";
import companyPageUz from "../../../messages/uz/company_page.json";
import discoveryPageUz from "../../../messages/uz/discovery_page.json";
import footerUz from "../../../messages/uz/footer.json";
import headerUz from "../../../messages/uz/header.json";

import type { TResources } from "./i18n.config";

export const RU_TRANSLATION_CHECKER: TResources = {
	common: commonRu,
	header: headerRu,
	footer: footerRu,
	discovery_page: discoveryPageRu,
	company_page: companyPageRu,
	catalog_page: catalogPageRu
};

export const UZ_TRANSLATION_CHECKER: TResources = {
	common: commonUz,
	header: headerUz,
	footer: footerUz,
	discovery_page: discoveryPageUz,
	company_page: companyPageUz,
	catalog_page: catalogPageUz
};
