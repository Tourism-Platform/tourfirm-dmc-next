import type { TMainI18nKey } from "./common.types";

export type TExperienceId =
	| "historical_walks"
	| "craft_meetings"
	| "bazaar_courtyard"
	| "sacred_heritage"
	| "nature_routes"
	| "desert_oasis";

export type TExperienceI18n = {
	badge: TMainI18nKey;
	title: TMainI18nKey;
	description: TMainI18nKey;
};

export type TExperienceConfig = {
	id: TExperienceId;
	imageUrl: string;
	i18n: TExperienceI18n;
};

export const MAIN_EXPERIENCE_I18N: Record<TExperienceId, TExperienceI18n> = {
	historical_walks: {
		badge: "experiences.items.historical_walks.badge",
		title: "experiences.items.historical_walks.title",
		description: "experiences.items.historical_walks.description"
	},
	craft_meetings: {
		badge: "experiences.items.craft_meetings.badge",
		title: "experiences.items.craft_meetings.title",
		description: "experiences.items.craft_meetings.description"
	},
	bazaar_courtyard: {
		badge: "experiences.items.bazaar_courtyard.badge",
		title: "experiences.items.bazaar_courtyard.title",
		description: "experiences.items.bazaar_courtyard.description"
	},
	sacred_heritage: {
		badge: "experiences.items.sacred_heritage.badge",
		title: "experiences.items.sacred_heritage.title",
		description: "experiences.items.sacred_heritage.description"
	},
	nature_routes: {
		badge: "experiences.items.nature_routes.badge",
		title: "experiences.items.nature_routes.title",
		description: "experiences.items.nature_routes.description"
	},
	desert_oasis: {
		badge: "experiences.items.desert_oasis.badge",
		title: "experiences.items.desert_oasis.title",
		description: "experiences.items.desert_oasis.description"
	}
};
