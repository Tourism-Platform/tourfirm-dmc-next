import type { TypedLocale } from "payload";
import "server-only";

import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import type {
	TResolvedFooterColumn,
	TResolvedNavLink,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";

import { getFooter, getHeader } from "../api";

import {
	resolveFooterNavigation,
	resolveHeaderNavigation
} from "./resolve-navigation";

export type TLayoutNavigation = {
	navItems: TResolvedNavLink[];
	footerColumns: TResolvedFooterColumn[];
	socialLinks: TResolvedSocialLink[];
	logoSrc?: string;
	copyrightText?: string;
};

export async function loadLayoutNavigation(
	locale: string
): Promise<TLayoutNavigation> {
	const typedLocale = locale as TypedLocale;
	const [headerGlobal, footerGlobal] = await Promise.all([
		getHeader(typedLocale),
		getFooter(typedLocale)
	]);

	const navItems = resolveHeaderNavigation(locale, headerGlobal?.navItems);
	const footerColumns = resolveFooterNavigation(
		locale,
		footerGlobal?.columns
	);

	const socialLinks =
		footerGlobal?.socialLinks?.map((link, index) => ({
			key: link.id ?? String(index),
			platform: link.platform,
			url: link.url
		})) ?? [];

	const logoSrc = resolveMediaUrl(headerGlobal?.logo) || undefined;

	return {
		navItems,
		footerColumns,
		socialLinks,
		logoSrc,
		copyrightText: footerGlobal?.copyrightText ?? undefined
	};
}
