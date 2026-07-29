export type TInformationNavCollection = "news" | "blog" | "trade-fairs";

export type TInformationNavItem = {
	id: string;
	slug: string;
	title: string;
	href: string;
};

export type TInformationNavArea = {
	key: string;
	collection: TInformationNavCollection;
	label: string;
	hubHref: string;
	items: TInformationNavItem[];
};

export type TInformationNavTree = {
	areas: TInformationNavArea[];
};

export type TInformationAreaConfig = {
	id?: string | null;
	collection: TInformationNavCollection;
	label?: string | null;
};
