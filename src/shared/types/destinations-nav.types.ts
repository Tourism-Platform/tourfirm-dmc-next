export type TDestinationsNavNode = {
	id: string;
	slug: string;
	title: string;
	href: string;
	featured?: boolean;
};

export type TDestinationsNavRegion = TDestinationsNavNode & {
	cities: TDestinationsNavNode[];
};

export type TDestinationsNavCountry = TDestinationsNavNode & {
	regions: TDestinationsNavRegion[];
};

export type TDestinationsNavTree = {
	rootHref: string;
	countries: TDestinationsNavCountry[];
};
