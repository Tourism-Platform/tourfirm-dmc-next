import { ENUM_PATH } from "@/shared/config";

import type { TBreadcrumbItem } from "./build-geo-breadcrumbs";

export function buildDiscoveryBreadcrumbs(
	items: { label: string; href: string }[]
): TBreadcrumbItem[] {
	return [{ label: "Home", href: ENUM_PATH.MAIN.ROOT }, ...items];
}

export function buildRouteDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: "Routes", href: ENUM_PATH.DISCOVERY.ROUTES },
		{ label: title, href: ENUM_PATH.DISCOVERY.routeDetail(slug) }
	]);
}

export function buildExperienceDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: "Experiences", href: ENUM_PATH.DISCOVERY.EXPERIENCES },
		{ label: title, href: ENUM_PATH.DISCOVERY.experienceDetail(slug) }
	]);
}

export function buildThemeDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: title, href: ENUM_PATH.DISCOVERY.themeDetail(slug) }
	]);
}

export function buildTradeFairDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: "Company", href: ENUM_PATH.COMPANY.ABOUT },
		{
			label: "Trade fairs",
			href: ENUM_PATH.COMPANY.TRADE_FAIRS
		},
		{
			label: title,
			href: ENUM_PATH.COMPANY.tradeFairDetail(slug)
		}
	]);
}

export function buildBlogDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: "Blog", href: ENUM_PATH.DISCOVERY.BLOG },
		{ label: title, href: ENUM_PATH.DISCOVERY.blogDetail(slug) }
	]);
}

export function buildNewsDetailBreadcrumbs(
	title: string,
	slug: string
): TBreadcrumbItem[] {
	return buildDiscoveryBreadcrumbs([
		{ label: "Company", href: ENUM_PATH.COMPANY.ABOUT },
		{ label: "News", href: ENUM_PATH.COMPANY.NEWS },
		{ label: title, href: ENUM_PATH.COMPANY.newsDetail(slug) }
	]);
}
