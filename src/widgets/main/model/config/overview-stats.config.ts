import { MAIN_OVERVIEW_STAT_I18N, type TOverviewStatConfig } from "../types";

export const MAIN_OVERVIEW_STATS_CONFIG: TOverviewStatConfig[] = [
	{ icon: "map-pin", i18n: MAIN_OVERVIEW_STAT_I18N.base },
	{ icon: "globe-2", i18n: MAIN_OVERVIEW_STAT_I18N.region },
	{ icon: "gauge", i18n: MAIN_OVERVIEW_STAT_I18N.planning },
	{ icon: "users", i18n: MAIN_OVERVIEW_STAT_I18N.formats },
	{
		icon: "message-circle",
		i18n: MAIN_OVERVIEW_STAT_I18N.communication
	}
];
