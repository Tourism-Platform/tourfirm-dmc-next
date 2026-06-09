import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";

import { MAIN_ROUTE_I18N, type TMainRouteConfig } from "../types";

import { MAIN_DESTINATION_IMAGES } from "./destination-images.config";

export const MAIN_FEATURED_ROUTES_CONFIG: TMainRouteConfig[] = [
	{
		id: "essentials",
		imageUrl: MAIN_DESTINATION_IMAGES.uzbekistan,
		ctaHref: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
			destination: "Uzbekistan"
		}),
		i18n: MAIN_ROUTE_I18N.essentials
	},
	{
		id: "silk_road",
		imageUrl: MAIN_DESTINATION_IMAGES.kyrgyzstan,
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: MAIN_ROUTE_I18N.silk_road
	},
	{
		id: "regional",
		imageUrl: MAIN_DESTINATION_IMAGES.tajikistan,
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: MAIN_ROUTE_I18N.regional
	}
];
