import type { TCompanyAboutI18nKey } from "./common.types";

export type TAboutHistoryId =
	| "founding"
	| "dmc"
	| "expansion"
	| "rebuild"
	| "fam_series"
	| "market_leader"
	| "fam_network"
	| "global_presence"
	| "tourlink";

export type TAboutHistoryConfig = {
	id: TAboutHistoryId;
	i18n: {
		year: TCompanyAboutI18nKey;
		title: TCompanyAboutI18nKey;
		description: TCompanyAboutI18nKey;
	};
};

export const ABOUT_HISTORY_I18N: Record<
	TAboutHistoryId,
	TAboutHistoryConfig["i18n"]
> = {
	founding: {
		year: "history.items.founding.year",
		title: "history.items.founding.title",
		description: "history.items.founding.description"
	},
	dmc: {
		year: "history.items.dmc.year",
		title: "history.items.dmc.title",
		description: "history.items.dmc.description"
	},
	expansion: {
		year: "history.items.expansion.year",
		title: "history.items.expansion.title",
		description: "history.items.expansion.description"
	},
	rebuild: {
		year: "history.items.rebuild.year",
		title: "history.items.rebuild.title",
		description: "history.items.rebuild.description"
	},
	fam_series: {
		year: "history.items.fam_series.year",
		title: "history.items.fam_series.title",
		description: "history.items.fam_series.description"
	},
	market_leader: {
		year: "history.items.market_leader.year",
		title: "history.items.market_leader.title",
		description: "history.items.market_leader.description"
	},
	fam_network: {
		year: "history.items.fam_network.year",
		title: "history.items.fam_network.title",
		description: "history.items.fam_network.description"
	},
	global_presence: {
		year: "history.items.global_presence.year",
		title: "history.items.global_presence.title",
		description: "history.items.global_presence.description"
	},
	tourlink: {
		year: "history.items.tourlink.year",
		title: "history.items.tourlink.title",
		description: "history.items.tourlink.description"
	}
};
