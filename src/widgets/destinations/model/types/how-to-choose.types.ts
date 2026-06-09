import type { TSectionI18n } from "./common.types";

export type THowToChooseId = "center" | "expand" | "pace";

export type THowToChooseConfig = {
	id: THowToChooseId;
	i18n: TSectionI18n;
};

export const HOW_TO_CHOOSE_I18N: Record<THowToChooseId, TSectionI18n> = {
	center: {
		title: "how_to_choose.items.center.title",
		description: "how_to_choose.items.center.description"
	},
	expand: {
		title: "how_to_choose.items.expand.title",
		description: "how_to_choose.items.expand.description"
	},
	pace: {
		title: "how_to_choose.items.pace.title",
		description: "how_to_choose.items.pace.description"
	}
};
