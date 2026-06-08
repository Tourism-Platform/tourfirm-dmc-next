export interface INavMobileItemBase {
	label: string;
	href?: string;
	submenu?: boolean;
	//   type?: "description" | "simple" | "icon"
	type?: string;
	items?: INavMobileSubItem[];
}

export interface INavMobileSubItem {
	label: string;
	href: string;
	description?: string;
	icon?: string;
}
