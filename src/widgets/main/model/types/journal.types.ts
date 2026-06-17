import type { TMainI18nKey } from "./common.types";

export type TJournalId = "quiet_square" | "craft_workshop" | "road_day";

export type TJournalI18n = {
	meta: TMainI18nKey;
	title: TMainI18nKey;
};

export type TJournalConfig = {
	id: TJournalId;
	imageUrl: string;
	i18n: TJournalI18n;
};

export const MAIN_JOURNAL_I18N: Record<TJournalId, TJournalI18n> = {
	quiet_square: {
		meta: "journal.items.quiet_square.meta",
		title: "journal.items.quiet_square.title"
	},
	craft_workshop: {
		meta: "journal.items.craft_workshop.meta",
		title: "journal.items.craft_workshop.title"
	},
	road_day: {
		meta: "journal.items.road_day.meta",
		title: "journal.items.road_day.title"
	}
};
