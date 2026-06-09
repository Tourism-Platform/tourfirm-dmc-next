import { MAIN_TRIP_FORMAT_I18N, type TTripFormatConfig } from "../types";

export const MAIN_TRIP_FORMATS_CONFIG: TTripFormatConfig[] = [
	{ id: "private", i18n: MAIN_TRIP_FORMAT_I18N.private },
	{ id: "group", i18n: MAIN_TRIP_FORMAT_I18N.group },
	{ id: "family", i18n: MAIN_TRIP_FORMAT_I18N.family },
	{ id: "mice", i18n: MAIN_TRIP_FORMAT_I18N.mice }
];
