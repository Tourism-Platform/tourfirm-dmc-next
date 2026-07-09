import type { TypedLocale } from "payload";
import "server-only";

import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type {
	TResolvedFooterColumn,
	TResolvedNavLink,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";

import { getDestination, getFooter, getHeader } from "../api";
import { getDestinationsNavTree } from "../api/get-destinations-nav-tree";
import { getExperiencesNavTree } from "../api/get-experiences-nav-tree";
import { getRoutesNavTree } from "../api/get-routes-nav-tree";

import {
	resolveFooterNavigation,
	resolveHeaderNavigation
} from "./resolve-navigation";

export type TLayoutNavigation = {
	navItems: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	routesNav: TDiscoveryNavTree | null;
	experiencesNav: TDiscoveryNavTree | null;
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
	const [destinationsNav, routesNav, experiencesNav] = await Promise.all([
		getDestinationsNavTree(locale, destinationSlug),
		getRoutesNavTree(locale),
		getExperiencesNavTree(locale)
	]);
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
		routesNav,
		experiencesNav,
		footerColumns,
		socialLinks,
		logoSrc,
		copyrightText: footerGlobal?.copyrightText ?? undefined
	};
}
