export interface ICountryCard {
	href: string;
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
	cities: string[];
	featured?: boolean;
}

export type TCountryCardProps = {
	data: ICountryCard;
};
