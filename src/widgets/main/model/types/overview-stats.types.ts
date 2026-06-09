import type { TMainI18nKey } from "./common.types";

export type TOverviewStatId =
	| "base"
	| "region"
	| "planning"
	| "formats"
	| "communication";

export type TOverviewStatI18n = {
	label: TMainI18nKey;
	value: TMainI18nKey;
};

export type TOverviewStatConfig = {
	id: TOverviewStatId;
	i18n: TOverviewStatI18n;
};

export const MAIN_OVERVIEW_STAT_I18N: Record<
	TOverviewStatId,
	TOverviewStatI18n
> = {
	base: {
		label: "overview.stats.base.label",
		value: "overview.stats.base.value"
	},
	region: {
		label: "overview.stats.region.label",
		value: "overview.stats.region.value"
	},
	planning: {
		label: "overview.stats.planning.label",
		value: "overview.stats.planning.value"
	},
	formats: {
		label: "overview.stats.formats.label",
		value: "overview.stats.formats.value"
	},
	communication: {
		label: "overview.stats.communication.label",
		value: "overview.stats.communication.value"
	}
};
