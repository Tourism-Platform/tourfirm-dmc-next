import { MAIN_EXPERIENCE_I18N, type TExperienceConfig } from "../types";

import { MAIN_DESTINATION_IMAGES } from "./destination-images.config";

export const MAIN_EXPERIENCES_CONFIG: TExperienceConfig[] = [
	{
		id: "historical_walks",
		imageUrl: MAIN_DESTINATION_IMAGES.uzbekistan,
		i18n: MAIN_EXPERIENCE_I18N.historical_walks
	},
	{
		id: "craft_meetings",
		imageUrl: MAIN_DESTINATION_IMAGES.kyrgyzstan,
		i18n: MAIN_EXPERIENCE_I18N.craft_meetings
	},
	{
		id: "bazaar_courtyard",
		imageUrl: MAIN_DESTINATION_IMAGES.kazakhstan,
		i18n: MAIN_EXPERIENCE_I18N.bazaar_courtyard
	},
	{
		id: "sacred_heritage",
		imageUrl: MAIN_DESTINATION_IMAGES.tajikistan,
		i18n: MAIN_EXPERIENCE_I18N.sacred_heritage
	},
	{
		id: "nature_routes",
		imageUrl: MAIN_DESTINATION_IMAGES.turkmenistan,
		i18n: MAIN_EXPERIENCE_I18N.nature_routes
	},
	{
		id: "desert_oasis",
		imageUrl: MAIN_DESTINATION_IMAGES.uzbekistan,
		i18n: MAIN_EXPERIENCE_I18N.desert_oasis
	}
];
