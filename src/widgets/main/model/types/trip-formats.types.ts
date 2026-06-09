import type { TMainI18nKey } from "./common.types";

export type TTripFormatId = "private" | "group" | "family" | "mice";

export type TTripFormatI18n = {
	badge: TMainI18nKey;
	title: TMainI18nKey;
	description: TMainI18nKey;
};

export type TTripFormatConfig = {
	id: TTripFormatId;
	i18n: TTripFormatI18n;
};

export const MAIN_TRIP_FORMAT_I18N: Record<TTripFormatId, TTripFormatI18n> = {
	private: {
		badge: "trip_formats.items.private.badge",
		title: "trip_formats.items.private.title",
		description: "trip_formats.items.private.description"
	},
	group: {
		badge: "trip_formats.items.group.badge",
		title: "trip_formats.items.group.title",
		description: "trip_formats.items.group.description"
	},
	family: {
		badge: "trip_formats.items.family.badge",
		title: "trip_formats.items.family.title",
		description: "trip_formats.items.family.description"
	},
	mice: {
		badge: "trip_formats.items.mice.badge",
		title: "trip_formats.items.mice.title",
		description: "trip_formats.items.mice.description"
	}
};
