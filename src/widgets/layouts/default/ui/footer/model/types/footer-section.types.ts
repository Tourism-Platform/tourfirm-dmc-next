import { ENUM_PATH_TYPE } from "@/shared/config";
import type { TFooterKeys } from "@/shared/i18n";

export interface IFooterLinkConfig {
	label: TFooterKeys;
	path: ENUM_PATH_TYPE;
	isSoon?: boolean;
}

export interface IFooterSectionConfig {
	title: TFooterKeys;
	links: IFooterLinkConfig[];
}

export interface IFooterLink {
	label: string;
	path: ENUM_PATH_TYPE;
	isSoon?: boolean;
}
