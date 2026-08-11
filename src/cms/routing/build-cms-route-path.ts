import { DEFAULT_LOCALE } from "@config/supported-locales";

import { ENUM_PATH } from "@/shared/config";

import { getRouteDefinition } from "./collection-route.registry";

export function buildCmsRoutePath(
	routeKey: string,
	params?: { slug?: string; locale?: string }
): string {
	const entry = getRouteDefinition(routeKey);

	if (!entry) {
		return ENUM_PATH.MAIN.ROOT;
	}

	const base = `/${entry.hubPath.join("/")}`;
	const slug = params?.slug;
	const path = slug ? `${base}/${slug}` : base;

	if (params?.locale && params.locale !== DEFAULT_LOCALE) {
		return `/${params.locale}${path}`;
	}

	return path;
}
