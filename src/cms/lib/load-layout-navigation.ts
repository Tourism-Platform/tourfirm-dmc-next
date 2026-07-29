import type { TypedLocale } from "payload";
import "server-only";

import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";
import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TInformationNavTree } from "@/shared/types/information-nav.types";
import type {
	TResolvedFooterColumn,
	TResolvedNavLink,
	TResolvedSocialLink
} from "@/shared/types/navigation.types";

import { getDestination, getFooter, getHeader } from "../api";
import { getDestinationsNavTree } from "../api/get-destinations-nav-tree";
import { getExperiencesNavTree } from "../api/get-experiences-nav-tree";
import { getInformationNavTree } from "../api/get-information-nav-tree";
import { getRoutesNavTree } from "../api/get-routes-nav-tree";

import { mapExperiencesNavToFooterColumn } from "./map-experiences-nav-to-footer-column";
import { mapInformationAreasToFooterColumns } from "./map-information-areas-to-footer-columns";
import {
	resolveFooterNavigation,
	resolveHeaderNavigation
} from "./resolve-navigation";

export type TLayoutNavigation = {
	navItems: TResolvedNavLink[];
	destinationsNav: TDestinationsNavTree | null;
	routesNav: TDiscoveryNavTree | null;
	experiencesNav: TDiscoveryNavTree | null;
	informationNav: TInformationNavTree | null;
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
	const informationAreas = headerGlobal?.informationAreas ?? [];

	const [
		destinationsNav,
		routesNav,
		experiencesNav,
		experiencesNavFooter,
		informationNavFooter
	] = await Promise.all([
		getDestinationsNavTree(locale, destinationSlug),
		getRoutesNavTree(locale),
		getExperiencesNavTree(locale, "header"),
		getExperiencesNavTree(locale, "footer"),
		getInformationNavTree(locale, informationAreas, "footer")
	]);

	const navItems = resolveHeaderNavigation(
		locale,
		headerGlobal?.navItems,
		destinationSlug
	);
	const staticFooterColumns = resolveFooterNavigation(
		locale,
		footerGlobal?.columns
	);
	const informationViewAll =
		headerGlobal?.uiTexts?.public?.nav?.information?.viewAll?.trim() ||
		"View all";
	const experiencesTitle =
		headerGlobal?.uiTexts?.public?.nav?.experiences?.columns?.title?.trim() ||
		"Experiences";
	const experiencesViewAll =
		headerGlobal?.uiTexts?.public?.nav?.experiences?.viewAll?.trim() ||
		"View all";
	const informationFooterColumns = mapInformationAreasToFooterColumns(
		informationNavFooter,
		informationViewAll
	);
	const experiencesFooterColumn = mapExperiencesNavToFooterColumn(
		experiencesNavFooter,
		experiencesTitle,
		experiencesViewAll
	);
	const footerColumns = [
		...staticFooterColumns,
		...informationFooterColumns,
		...(experiencesFooterColumn ? [experiencesFooterColumn] : [])
	];

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
		informationNav: null,
		footerColumns,
		socialLinks,
		logoSrc,
		copyrightText: footerGlobal?.copyrightText ?? undefined
	};
}
