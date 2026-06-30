import type { TypedLocale } from "payload";
import "server-only";

import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type {
	TResolvedFooterColumn,
	TResolvedNavLink,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";

import { getDestination, getFooter, getHeader } from "../api";
import { getDestinationsNavTree } from "../api/get-destinations-nav-tree";

import {
	resolveFooterNavigation,
	resolveHeaderNavigation
} from "./resolve-navigation";

export type TLayoutNavigation = {
	navItems: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	footerColumns: TResolvedFooterColumn[];
	socialLinks: TResolvedSocialLink[];
	logoSrc?: string;
	copyrightText?: string;
};

export async function loadLayoutNavigation(
	locale: string
): Promise<TLayoutNavigation> {
	const typedLocale = locale as TypedLocale;
	const [headerGlobal, footerGlobal, destinationGlobal] = await Promise.all([
		getHeader(typedLocale),
		getFooter(typedLocale),
		getDestination(locale)
	]);

	const destinationSlug = destinationGlobal?.slug ?? "destinations";
	const destinationsNav = await getDestinationsNavTree(
		locale,
		destinationSlug
	);
	const navItems = resolveHeaderNavigation(
		locale,
		headerGlobal?.navItems,
		destinationSlug
	);
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
		destinationsNav,
		footerColumns,
		socialLinks,
		logoSrc,
		copyrightText: footerGlobal?.copyrightText ?? undefined
	};
}
