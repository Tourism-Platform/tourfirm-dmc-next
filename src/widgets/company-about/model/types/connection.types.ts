import type { TSectionI18n } from "./common.types";

export type TAboutConnectionId =
	| "geography"
	| "experience"
	| "business"
	| "access"
	| "generations";

export type TAboutConnectionConfig = {
	id: TAboutConnectionId;
	i18n: TSectionI18n;
};

export const ABOUT_CONNECTION_I18N: Record<TAboutConnectionId, TSectionI18n> = {
	geography: {
		title: "connection.items.geography.title",
		description: "connection.items.geography.description"
	},
	experience: {
		title: "connection.items.experience.title",
		description: "connection.items.experience.description"
	},
	business: {
		title: "connection.items.business.title",
		description: "connection.items.business.description"
	},
	access: {
		title: "connection.items.access.title",
		description: "connection.items.access.description"
	},
	generations: {
		title: "connection.items.generations.title",
		description: "connection.items.generations.description"
	}
};
