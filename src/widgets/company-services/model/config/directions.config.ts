import {
	SERVICES_DIRECTIONS_I18N,
	type TServicesDirectionConfig
} from "../types";

export const SERVICES_DIRECTIONS_CONFIG: TServicesDirectionConfig[] = [
	{
		id: "guides",
		imageUrl: "/assets/images/service-areas/private-guides.jpg",
		i18n: SERVICES_DIRECTIONS_I18N.guides
	},
	{
		id: "programs",
		imageUrl: "/assets/images/service-areas/bespoke-programs.jpg",
		i18n: SERVICES_DIRECTIONS_I18N.programs
	},
	{
		id: "business",
		imageUrl: "/assets/images/service-areas/business-travel.jpg",
		i18n: SERVICES_DIRECTIONS_I18N.business
	}
];
