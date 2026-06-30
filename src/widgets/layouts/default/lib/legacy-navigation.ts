import { getTranslations } from "next-intl/server";

import type {
	TResolvedFooterColumn,
	TResolvedNavLink
} from "@/shared/types/navigation.types";

import { FOOTER_SECTIONS } from "../ui/footer/model/config/footer-section.config";
import { SOCIAL_LINKS } from "../ui/footer/model/config/footer-social.config";
import { PUBLIC_NAV_ITEMS } from "../ui/header/model/config/public-nav.config";

export async function getLegacyHeaderNavigation(
	locale: string
): Promise<TResolvedNavLink[]> {
	const t = await getTranslations({ locale, namespace: "header" });

	return PUBLIC_NAV_ITEMS.map((entry, index) => ({
		key: String(index),
		label: t(entry.label),
		href: entry.path,
		sections: entry.sections.map((section, sectionIndex) => ({
			label: section.label ? t(section.label) : undefined,
			items: section.items.map((item, itemIndex) => ({
				key: `${index}-${sectionIndex}-${itemIndex}`,
				label: t(item.label),
				description: t(item.description),
				href: item.path,
				icon: item.icon.name,
				isSoon: item.isSoon
			}))
		}))
	}));
}

export async function getLegacyFooterNavigation(
	locale: string
): Promise<TResolvedFooterColumn[]> {
	const t = await getTranslations({ locale, namespace: "footer" });

	return FOOTER_SECTIONS.map((section, index) => ({
		key: String(index),
		title: t(section.title),
		links: section.links.map((link, linkIndex) => ({
			key: `${index}-${linkIndex}`,
			label: t(link.label),
			href: link.path,
			isSoon: link.isSoon
		}))
	}));
}

export function getLegacySocialLinks() {
	return SOCIAL_LINKS.map((item, index) => ({
		key: String(index),
		platform: item.name,
		url: item.path
	}));
}
