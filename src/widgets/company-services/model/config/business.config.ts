import { Briefcase, Building2, Mic2, Tent, Users } from "lucide-react";

import { SERVICES_BUSINESS_I18N, type TServicesBusinessConfig } from "../types";

export const SERVICES_BUSINESS_CONFIG: TServicesBusinessConfig[] = [
	{ id: "mice", icon: Building2, i18n: SERVICES_BUSINESS_I18N.mice },
	{
		id: "incentive",
		icon: Briefcase,
		i18n: SERVICES_BUSINESS_I18N.incentive
	},
	{ id: "retreats", icon: Tent, i18n: SERVICES_BUSINESS_I18N.retreats },
	{
		id: "conferences",
		icon: Mic2,
		i18n: SERVICES_BUSINESS_I18N.conferences
	},
	{ id: "groups", icon: Users, i18n: SERVICES_BUSINESS_I18N.groups }
];
