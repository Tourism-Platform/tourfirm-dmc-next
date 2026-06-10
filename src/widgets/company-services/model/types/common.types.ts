import type { TCompanyServicesPageKeys } from "@/shared/i18n";

export type TCompanyServicesI18nKey = TCompanyServicesPageKeys;

export type TSectionI18n = {
	title: TCompanyServicesI18nKey;
	description: TCompanyServicesI18nKey;
};

export type TDirectionI18n = TSectionI18n & {
	cta: TCompanyServicesI18nKey;
};

export type TProcessI18n = TSectionI18n & {
	step: TCompanyServicesI18nKey;
};

export type TBusinessI18n = TSectionI18n & {
	badge: TCompanyServicesI18nKey;
};
