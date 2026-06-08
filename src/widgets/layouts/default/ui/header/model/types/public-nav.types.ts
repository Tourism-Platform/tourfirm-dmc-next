import type { LucideIcon } from "lucide-react";

import { ENUM_PATH_TYPE } from "@/shared/config/routes";
import type { THeaderKeys } from "@/shared/i18n";

export interface IPublicNavItem {
	label: THeaderKeys;
	description: THeaderKeys;
	icon: LucideIcon;
	path?: ENUM_PATH_TYPE;
	isSoon?: boolean;
}

export interface IPublicNavSection {
	label?: THeaderKeys;
	items: IPublicNavItem[];
}

export interface IPublicNavLink {
	label: THeaderKeys;
	path?: ENUM_PATH_TYPE;
	sections: IPublicNavSection[];
}
