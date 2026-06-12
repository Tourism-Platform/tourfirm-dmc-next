import type { TCompanyAboutI18nKey } from "./common.types";

export type TAboutNotUsId =
	| "not_ota"
	| "not_aggregator"
	| "not_factory"
	| "not_middleman"
	| "not_faceless"
	| "not_discovery";

export type TAboutNotUsConfig = {
	id: TAboutNotUsId;
	i18n: {
		not: TCompanyAboutI18nKey;
		because: TCompanyAboutI18nKey;
	};
};

export const ABOUT_NOT_US_I18N: Record<
	TAboutNotUsId,
	TAboutNotUsConfig["i18n"]
> = {
	not_ota: {
		not: "not_us.items.not_ota.not",
		because: "not_us.items.not_ota.because"
	},
	not_aggregator: {
		not: "not_us.items.not_aggregator.not",
		because: "not_us.items.not_aggregator.because"
	},
	not_factory: {
		not: "not_us.items.not_factory.not",
		because: "not_us.items.not_factory.because"
	},
	not_middleman: {
		not: "not_us.items.not_middleman.not",
		because: "not_us.items.not_middleman.because"
	},
	not_faceless: {
		not: "not_us.items.not_faceless.not",
		because: "not_us.items.not_faceless.because"
	},
	not_discovery: {
		not: "not_us.items.not_discovery.not",
		because: "not_us.items.not_discovery.because"
	}
};
