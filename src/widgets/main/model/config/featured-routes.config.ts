import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";

import { MAIN_ROUTE_I18N, type TMainRouteConfig } from "../types";

export const MAIN_FEATURED_ROUTES_CONFIG: TMainRouteConfig[] = [
	{
		id: "essentials",
		imageUrl: "/assets/images/tours/classic.jpg",
		ctaHref: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG.ROOT, {
			destination: "Uzbekistan"
		}),
		i18n: MAIN_ROUTE_I18N.essentials
	},
	{
		id: "silk_road",
		imageUrl: "/assets/images/tours/silk-road.jpg",
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: MAIN_ROUTE_I18N.silk_road
	},
	{
		id: "regional",
		imageUrl: "/assets/images/tours/multi-country.jpg",
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: MAIN_ROUTE_I18N.regional
	}
];
