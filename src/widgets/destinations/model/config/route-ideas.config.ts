import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";

import { ROUTE_IDEAS_I18N, type TRouteIdeaConfig } from "../types";

import { DESTINATION_IMAGES } from "./destination-images.config";

export const ROUTE_IDEAS_CONFIG: TRouteIdeaConfig[] = [
	{
		id: "uzbekistan_intro",
		imageUrl: DESTINATION_IMAGES.uzbekistan,
		ctaHref: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
			destination: "Uzbekistan"
		}),
		i18n: ROUTE_IDEAS_I18N.uzbekistan_intro
	},
	{
		id: "uz_kg",
		imageUrl: DESTINATION_IMAGES.kyrgyzstan,
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: ROUTE_IDEAS_I18N.uz_kg
	},
	{
		id: "regional",
		imageUrl: DESTINATION_IMAGES.tajikistan,
		ctaHref: ENUM_PATH.HELP.CONTACT,
		i18n: ROUTE_IDEAS_I18N.regional
	}
];
