import type { TDestinationsI18nKey } from "./common.types";

export type TCountryId =
	| "uzbekistan"
	| "kazakhstan"
	| "kyrgyzstan"
	| "tajikistan"
	| "turkmenistan";

export type TCountryI18n = {
	name: TDestinationsI18nKey;
	badge: TDestinationsI18nKey;
	description: TDestinationsI18nKey;
	cities: readonly TDestinationsI18nKey[];
};

export type TCountryConfig = {
	id: TCountryId;
	imageUrl: string;
	catalogDestination: string;
	i18n: TCountryI18n;
};

export const COUNTRY_I18N: Record<TCountryId, TCountryI18n> = {
	uzbekistan: {
		name: "countries.items.uzbekistan.name",
		badge: "countries.items.uzbekistan.badge",
		description: "countries.items.uzbekistan.description",
		cities: [
			"countries.items.uzbekistan.cities.tashkent",
			"countries.items.uzbekistan.cities.samarkand",
			"countries.items.uzbekistan.cities.bukhara",
			"countries.items.uzbekistan.cities.khiva"
		]
	},
	kazakhstan: {
		name: "countries.items.kazakhstan.name",
		badge: "countries.items.kazakhstan.badge",
		description: "countries.items.kazakhstan.description",
		cities: [
			"countries.items.kazakhstan.cities.almaty",
			"countries.items.kazakhstan.cities.turkestan",
			"countries.items.kazakhstan.cities.charyn",
			"countries.items.kazakhstan.cities.mangystau"
		]
	},
	kyrgyzstan: {
		name: "countries.items.kyrgyzstan.name",
		badge: "countries.items.kyrgyzstan.badge",
		description: "countries.items.kyrgyzstan.description",
		cities: [
			"countries.items.kyrgyzstan.cities.bishkek",
			"countries.items.kyrgyzstan.cities.issyk_kul",
			"countries.items.kyrgyzstan.cities.karakol",
			"countries.items.kyrgyzstan.cities.son_kul"
		]
	},
	tajikistan: {
		name: "countries.items.tajikistan.name",
		badge: "countries.items.tajikistan.badge",
		description: "countries.items.tajikistan.description",
		cities: [
			"countries.items.tajikistan.cities.dushanbe",
			"countries.items.tajikistan.cities.fan_mountains",
			"countries.items.tajikistan.cities.seven_lakes",
			"countries.items.tajikistan.cities.pamir"
		]
	},
	turkmenistan: {
		name: "countries.items.turkmenistan.name",
		badge: "countries.items.turkmenistan.badge",
		description: "countries.items.turkmenistan.description",
		cities: [
			"countries.items.turkmenistan.cities.ashgabat",
			"countries.items.turkmenistan.cities.nisa",
			"countries.items.turkmenistan.cities.merw",
			"countries.items.turkmenistan.cities.darvaza"
		]
	}
};
