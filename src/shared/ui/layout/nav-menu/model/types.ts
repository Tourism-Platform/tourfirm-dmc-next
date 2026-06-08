import { THeaderKeys } from "@/shared/i18n";

export interface INavItemBase {
	label: THeaderKeys;
	href?: string;
	submenu?: boolean;
	type?: string;
	items?: INavSubItem[];
}

export interface INavSubItem {
	label: THeaderKeys;
	href: string;
	description?: THeaderKeys;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
