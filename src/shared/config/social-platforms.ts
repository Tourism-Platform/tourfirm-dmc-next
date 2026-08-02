import type { IconType } from "react-icons";
import { FaTripadvisor } from "react-icons/fa";
import {
	FaFacebookF,
	FaGlobe,
	FaInstagram,
	FaLinkedinIn,
	FaOdnoklassniki,
	FaPinterestP,
	FaTelegram,
	FaTiktok,
	FaViber,
	FaVk,
	FaWeixin,
	FaWhatsapp,
	FaXTwitter,
	FaYoutube
} from "react-icons/fa6";
import { SiThreads } from "react-icons/si";

export const SOCIAL_PLATFORM_IDS = [
	"instagram",
	"telegram",
	"facebook",
	"whatsapp",
	"youtube",
	"tiktok",
	"linkedin",
	"x",
	"vk",
	"ok",
	"pinterest",
	"tripadvisor",
	"threads",
	"viber",
	"wechat"
] as const;

export type TSocialPlatformId = (typeof SOCIAL_PLATFORM_IDS)[number];

export type TSocialPlatformMeta = {
	id: TSocialPlatformId;
	label: string;
	defaultUrl: string;
};

export const SOCIAL_PLATFORMS: TSocialPlatformMeta[] = [
	{
		id: "instagram",
		label: "Instagram",
		defaultUrl: "https://www.instagram.com/tourlink.uz"
	},
	{
		id: "telegram",
		label: "Telegram",
		defaultUrl: "https://t.me/tourlink_uz"
	},
	{
		id: "facebook",
		label: "Facebook",
		defaultUrl: "https://www.facebook.com/tourlink.uz"
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		defaultUrl: "https://wa.me/998901234567"
	},
	{
		id: "youtube",
		label: "YouTube",
		defaultUrl: "https://www.youtube.com/@tourlink"
	},
	{
		id: "tiktok",
		label: "TikTok",
		defaultUrl: "https://www.tiktok.com/@tourlink.uz"
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		defaultUrl: "https://www.linkedin.com/company/tourlink"
	},
	{
		id: "x",
		label: "X",
		defaultUrl: "https://x.com/tourlink_uz"
	},
	{
		id: "vk",
		label: "VK",
		defaultUrl: "https://vk.com/tourlink"
	},
	{
		id: "ok",
		label: "Odnoklassniki",
		defaultUrl: "https://ok.ru/tourlink"
	},
	{
		id: "pinterest",
		label: "Pinterest",
		defaultUrl: "https://www.pinterest.com/tourlink"
	},
	{
		id: "tripadvisor",
		label: "TripAdvisor",
		defaultUrl: "https://www.tripadvisor.com/Profile/TourLink"
	},
	{
		id: "threads",
		label: "Threads",
		defaultUrl: "https://www.threads.net/@tourlink.uz"
	},
	{
		id: "viber",
		label: "Viber",
		defaultUrl: "https://invite.viber.com/?g2=tourlink"
	},
	{
		id: "wechat",
		label: "WeChat",
		defaultUrl: "https://tourlink.uz/wechat"
	}
];

const SOCIAL_PLATFORM_ICONS: Record<TSocialPlatformId, IconType> = {
	instagram: FaInstagram,
	telegram: FaTelegram,
	facebook: FaFacebookF,
	whatsapp: FaWhatsapp,
	youtube: FaYoutube,
	tiktok: FaTiktok,
	linkedin: FaLinkedinIn,
	x: FaXTwitter,
	vk: FaVk,
	ok: FaOdnoklassniki,
	pinterest: FaPinterestP,
	tripadvisor: FaTripadvisor,
	threads: SiThreads,
	viber: FaViber,
	wechat: FaWeixin
};

export function isSocialPlatformId(value: string): value is TSocialPlatformId {
	return (SOCIAL_PLATFORM_IDS as readonly string[]).includes(value);
}

export function getSocialPlatformIcon(platform: string): IconType {
	if (isSocialPlatformId(platform)) {
		return SOCIAL_PLATFORM_ICONS[platform];
	}

	return FaGlobe;
}

export const socialPlatformSelectOptions = SOCIAL_PLATFORMS.map((platform) => ({
	label: platform.label,
	value: platform.id
}));
