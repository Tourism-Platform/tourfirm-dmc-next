import { cache } from "react";

import type { TAppRoute } from "./app-route.types";
import { loadRouteDependencies } from "./load-route-dependencies";
import { loadRouteEntity } from "./load-route-entity";
import type { TRouteData } from "./types/route-data.types";
import { auditSpan } from "@/cms/perf/audit-span";

type TLoadRouteDataResult = {
	data: TRouteData;
	entityResult: Awaited<ReturnType<typeof loadRouteEntity>>;
};
type TSearchParams = {
	page?: string;
	theme?: string;
	country?: string;
};
const loadRouteDataInflight = new Map<string, Promise<TLoadRouteDataResult>>();
function searchParamsCacheKey(searchParams?: TSearchParams): string {
	const page = searchParams?.page?.trim() || "";
	const theme = searchParams?.theme?.trim() || "";
	const country = searchParams?.country?.trim() || "";
	if (!page && !theme && !country) {
		return "";
	}
	return `${page}:${theme}:${country}`;
}
function loadRouteDataCacheKey(
	route: TAppRoute,
	locale: string,
	searchParams?: TSearchParams
): string {
	return [
		locale,
		route.routeKey,
		route.kind,
		"slug" in route ? (route.slug ?? "") : "",
		searchParamsCacheKey(searchParams)
	].join(":");
}
async function loadRouteDataWork(
	route: TAppRoute,
	locale: string,
	searchParams?: TSearchParams
): Promise<TLoadRouteDataResult> {
	const entityResult = await auditSpan(
		"loadRouteEntity",
		{ locale, routeKey: route.routeKey, kind: route.kind },
		() => loadRouteEntity(route, locale)
	);
	const data = await auditSpan(
		"loadRouteDependencies",
		{ locale, routeKey: route.routeKey, kind: route.kind },
		() => loadRouteDependencies(route, entityResult, locale, searchParams)
	);
	return { data, entityResult };
}
export const loadRouteData = cache(
	async (
		route: TAppRoute,
		locale: string,
		searchParams?: TSearchParams
	): Promise<TLoadRouteDataResult> => {
		const key = loadRouteDataCacheKey(route, locale, searchParams);
		const existing = loadRouteDataInflight.get(key);
		if (existing) {
			return existing;
		}
		const pending = loadRouteDataWork(route, locale, searchParams).finally(
			() => {
				loadRouteDataInflight.delete(key);
			}
		);
		loadRouteDataInflight.set(key, pending);
		return pending;
	}
);
