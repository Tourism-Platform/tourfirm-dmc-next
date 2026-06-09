import { MAIN_COUNTRY_I18N, type TMainCountryConfig } from "../types";

import { MAIN_DESTINATION_IMAGES } from "./destination-images.config";

export const MAIN_COUNTRIES_CONFIG: TMainCountryConfig[] = [
	{
		id: "uzbekistan",
		imageUrl: MAIN_DESTINATION_IMAGES.uzbekistan,
		catalogDestination: "Uzbekistan",
		i18n: MAIN_COUNTRY_I18N.uzbekistan
	},
	{
		id: "kazakhstan",
		imageUrl: MAIN_DESTINATION_IMAGES.kazakhstan,
		catalogDestination: "Kazakhstan",
		i18n: MAIN_COUNTRY_I18N.kazakhstan
	},
	{
		id: "kyrgyzstan",
		imageUrl: MAIN_DESTINATION_IMAGES.kyrgyzstan,
		catalogDestination: "Kyrgyzstan",
		i18n: MAIN_COUNTRY_I18N.kyrgyzstan
	},
	{
		id: "tajikistan",
		imageUrl: MAIN_DESTINATION_IMAGES.tajikistan,
		catalogDestination: "Tajikistan",
		i18n: MAIN_COUNTRY_I18N.tajikistan
	},
	{
		id: "turkmenistan",
		imageUrl: MAIN_DESTINATION_IMAGES.turkmenistan,
		catalogDestination: "Turkmenistan",
		i18n: MAIN_COUNTRY_I18N.turkmenistan
	}
];
