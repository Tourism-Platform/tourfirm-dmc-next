import type { TSectionI18n } from "./common.types";

export type TAboutValuesId =
	| "expertise"
	| "reliability"
	| "transparency"
	| "speed"
	| "passion"
	| "respect"
	| "partnership";

export type TAboutValuesConfig = {
	id: TAboutValuesId;
	i18n: TSectionI18n;
};

export const ABOUT_VALUES_I18N: Record<TAboutValuesId, TSectionI18n> = {
	expertise: {
		title: "values.items.expertise.title",
		description: "values.items.expertise.description"
	},
	reliability: {
		title: "values.items.reliability.title",
		description: "values.items.reliability.description"
	},
	transparency: {
		title: "values.items.transparency.title",
		description: "values.items.transparency.description"
	},
	speed: {
		title: "values.items.speed.title",
		description: "values.items.speed.description"
	},
	passion: {
		title: "values.items.passion.title",
		description: "values.items.passion.description"
	},
	respect: {
		title: "values.items.respect.title",
		description: "values.items.respect.description"
	},
	partnership: {
		title: "values.items.partnership.title",
		description: "values.items.partnership.description"
	}
};
