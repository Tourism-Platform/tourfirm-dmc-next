import type { LucideIcon } from "lucide-react";

import type { TBusinessI18n } from "./common.types";

export type TServicesBusinessId =
	| "mice"
	| "incentive"
	| "retreats"
	| "conferences"
	| "groups";

export type TServicesBusinessConfig = {
	id: TServicesBusinessId;
	icon: LucideIcon;
	i18n: TBusinessI18n;
};

export const SERVICES_BUSINESS_I18N: Record<
	TServicesBusinessId,
	TBusinessI18n
> = {
	mice: {
		badge: "business.items.mice.badge",
		title: "business.items.mice.title",
		description: "business.items.mice.description"
	},
	incentive: {
		badge: "business.items.incentive.badge",
		title: "business.items.incentive.title",
		description: "business.items.incentive.description"
	},
	retreats: {
		badge: "business.items.retreats.badge",
		title: "business.items.retreats.title",
		description: "business.items.retreats.description"
	},
	conferences: {
		badge: "business.items.conferences.badge",
		title: "business.items.conferences.title",
		description: "business.items.conferences.description"
	},
	groups: {
		badge: "business.items.groups.badge",
		title: "business.items.groups.title",
		description: "business.items.groups.description"
	}
};
