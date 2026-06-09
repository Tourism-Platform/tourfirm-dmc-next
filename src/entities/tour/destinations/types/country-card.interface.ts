export interface ICountryCard {
	href: string;
	imageUrl: string;
	imageAlt: string;
	badge: string;
	name: string;
	description: string;
	cities: string[];
	featured?: boolean;
}
