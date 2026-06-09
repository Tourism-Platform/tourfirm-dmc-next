import { COUNTRY_I18N, type TCountryConfig } from "../types";

import { DESTINATION_IMAGES } from "./destination-images.config";

export const COUNTRIES_CONFIG: TCountryConfig[] = [
	{
		id: "uzbekistan",
		imageUrl: DESTINATION_IMAGES.uzbekistan,
		catalogDestination: "Uzbekistan",
		i18n: COUNTRY_I18N.uzbekistan
	},
	{
		id: "kazakhstan",
		imageUrl: DESTINATION_IMAGES.kazakhstan,
		catalogDestination: "Kazakhstan",
		i18n: COUNTRY_I18N.kazakhstan
	},
	{
		id: "kyrgyzstan",
		imageUrl: DESTINATION_IMAGES.kyrgyzstan,
		catalogDestination: "Kyrgyzstan",
		i18n: COUNTRY_I18N.kyrgyzstan
	},
	{
		id: "tajikistan",
		imageUrl: DESTINATION_IMAGES.tajikistan,
		catalogDestination: "Tajikistan",
		i18n: COUNTRY_I18N.tajikistan
	},
	{
		id: "turkmenistan",
		imageUrl: DESTINATION_IMAGES.turkmenistan,
		catalogDestination: "Turkmenistan",
		i18n: COUNTRY_I18N.turkmenistan
	}
];
