import type { TSectionI18n } from "./common.types";

export type TAboutWhyId =
	| "experience"
	| "languages"
	| "individual"
	| "routes"
	| "quality"
	| "sustainability";

export type TAboutWhyConfig = {
	id: TAboutWhyId;
	i18n: TSectionI18n;
};

export const ABOUT_WHY_I18N: Record<TAboutWhyId, TSectionI18n> = {
	experience: {
		title: "why.items.experience.title",
		description: "why.items.experience.description"
	},
	languages: {
		title: "why.items.languages.title",
		description: "why.items.languages.description"
	},
	individual: {
		title: "why.items.individual.title",
		description: "why.items.individual.description"
	},
	routes: {
		title: "why.items.routes.title",
		description: "why.items.routes.description"
	},
	quality: {
		title: "why.items.quality.title",
		description: "why.items.quality.description"
	},
	sustainability: {
		title: "why.items.sustainability.title",
		description: "why.items.sustainability.description"
	}
};
