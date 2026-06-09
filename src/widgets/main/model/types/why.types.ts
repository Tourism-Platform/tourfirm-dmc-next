import type { TMainI18nKey } from "./common.types";

export type TMainWhyId = "programs" | "rhythm" | "connection";

export type TMainWhyI18n = {
	title: TMainI18nKey;
	description: TMainI18nKey;
};

export type TMainWhyConfig = {
	id: TMainWhyId;
	i18n: TMainWhyI18n;
};

export const MAIN_WHY_I18N: Record<TMainWhyId, TMainWhyI18n> = {
	programs: {
		title: "why.items.programs.title",
		description: "why.items.programs.description"
	},
	rhythm: {
		title: "why.items.rhythm.title",
		description: "why.items.rhythm.description"
	},
	connection: {
		title: "why.items.connection.title",
		description: "why.items.connection.description"
	}
};
