export type TNavigationTarget = "_self" | "_blank";

export type TResolvedNavItem = {
	key: string;
	label: string;
	description?: string;
	href?: string;
	target?: TNavigationTarget;
	icon?: string;
	isSoon?: boolean;
};

export type TResolvedNavSection = {
	label?: string;
	items: TResolvedNavItem[];
};

export type TResolvedNavLink = {
	key: string;
	label: string;
	href?: string;
	target?: TNavigationTarget;
	icon?: string;
	sections: TResolvedNavSection[];
};

export type TResolvedFooterLink = {
	key: string;
	label: string;
	href: string;
	target?: TNavigationTarget;
	isSoon?: boolean;
};

export type TResolvedFooterColumn = {
	key: string;
	title: string;
	links: TResolvedFooterLink[];
};

export type TResolvedSocialLink = {
	key: string;
	platform: string;
	url: string;
};
