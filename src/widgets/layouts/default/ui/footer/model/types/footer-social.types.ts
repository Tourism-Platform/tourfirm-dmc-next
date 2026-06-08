import type { TFooterKeys } from "@/shared/i18n";

export enum ESocialName {
	Instagram = "instagram",
	Telegram = "telegram",
	Facebook = "facebook",
	Whatsapp = "whatsapp"
}

export interface ISocialLinkConfig {
	name: ESocialName;
	label: TFooterKeys;
	path: string;
}

export interface IFooterSocialItem {
	name: ESocialName;
	label: string;
	path: string;
}

export interface IFooterSocialProps {
	items: IFooterSocialItem[];
}
