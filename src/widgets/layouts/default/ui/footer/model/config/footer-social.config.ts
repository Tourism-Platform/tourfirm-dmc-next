import {
	Camera,
	type LucideIcon,
	MessageCircle,
	Send,
	Share2
} from "lucide-react";

import {
	ESocialName,
	type ISocialLinkConfig
} from "../types/footer-social.types";

export const SOCIAL_ICONS: Record<ESocialName, LucideIcon> = {
	[ESocialName.Instagram]: Camera,
	[ESocialName.Telegram]: Send,
	[ESocialName.Facebook]: Share2,
	[ESocialName.Whatsapp]: MessageCircle
};

export const SOCIAL_LINKS: ISocialLinkConfig[] = [
	{
		name: ESocialName.Instagram,
		label: "social.instagram",
		path: "#"
	},
	{
		name: ESocialName.Telegram,
		label: "social.telegram",
		path: "#"
	},
	{
		name: ESocialName.Facebook,
		label: "social.facebook",
		path: "#"
	},
	{
		name: ESocialName.Whatsapp,
		label: "social.whatsapp",
		path: "#"
	}
];
