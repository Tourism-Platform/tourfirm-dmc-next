import type { TSectionI18n } from "./common.types";

export type TPlanningCheckId = "access" | "season" | "movement";

export type TPlanningCheckConfig = {
	id: TPlanningCheckId;
	i18n: TSectionI18n;
};

export const PLANNING_CHECKS_I18N: Record<TPlanningCheckId, TSectionI18n> = {
	access: {
		title: "planning_checks.items.access.title",
		description: "planning_checks.items.access.description"
	},
	season: {
		title: "planning_checks.items.season.title",
		description: "planning_checks.items.season.description"
	},
	movement: {
		title: "planning_checks.items.movement.title",
		description: "planning_checks.items.movement.description"
	}
};
