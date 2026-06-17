import { MAIN_JOURNAL_I18N, type TJournalConfig } from "../types";

import {
	MAIN_DESTINATION_IMAGES,
	MAIN_HERO_IMAGE
} from "./destination-images.config";

export const MAIN_JOURNAL_CONFIG: TJournalConfig[] = [
	{
		id: "quiet_square",
		imageUrl: MAIN_DESTINATION_IMAGES.uzbekistan,
		i18n: MAIN_JOURNAL_I18N.quiet_square
	},
	{
		id: "craft_workshop",
		imageUrl: MAIN_DESTINATION_IMAGES.kyrgyzstan,
		i18n: MAIN_JOURNAL_I18N.craft_workshop
	},
	{
		id: "road_day",
		imageUrl: MAIN_HERO_IMAGE,
		i18n: MAIN_JOURNAL_I18N.road_day
	}
];
