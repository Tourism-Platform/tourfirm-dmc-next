export type TDiscoveryNavItem = {
	id: string;
	slug: string;
	title: string;
	href: string;
	subtitle?: string;
};

export type TDiscoveryNavTree = {
	rootHref: string;
	items: TDiscoveryNavItem[];
};
