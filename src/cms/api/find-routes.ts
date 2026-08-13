import config from "@payload-config";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DISCOVERY_LIST_DEFAULT_LIMIT,
	type TDiscoveryListResult,
	type TRouteListFilters
} from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import type { Route } from "@/payload-types";

async function resolveRouteFilterIds(filters: TRouteListFilters): Promise<{
	themeId?: number;
	countryId?: number;
}> {
	const payload = await getPayload({ config });
	const result: {
		themeId?: number;
		countryId?: number;
	} = {};
	if (filters.theme) {
		const themeResult = await payload.find({
			collection: "themes",
			where: { slug: { equals: filters.theme } },
			limit: 1,
			depth: 0,
			locale: "en"
		});
		const themeId = themeResult.docs[0]?.id;
		if (typeof themeId === "number") {
			result.themeId = themeId;
		}
	}
	if (filters.country) {
		const countryResult = await payload.find({
			collection: "countries",
			where: { slug: { equals: filters.country } },
			limit: 1,
			depth: 0,
			locale: "en"
		});
		const countryId = countryResult.docs[0]?.id;
		if (typeof countryId === "number") {
			result.countryId = countryId;
		}
	}
	return result;
}
function buildRouteWhere(
	filters: TRouteListFilters,
	ids: {
		themeId?: number;
		countryId?: number;
	}
): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];
	if (filters.theme && ids.themeId) {
		and.push({ themes: { contains: ids.themeId } });
	}
	if (filters.country && ids.countryId) {
		and.push({ countries: { contains: ids.countryId } });
	}
	if (filters.scope) {
		and.push({ routeScope: { equals: filters.scope } });
	}
	if (filters.featured) {
		and.push({ featured: { equals: true } });
	}
	return { and };
}
async function fetchRoutes(
	locale: string,
	filtersKey: string
): Promise<TDiscoveryListResult<Route>> {
	const filters = JSON.parse(filtersKey) as TRouteListFilters;
	try {
		const payload = await getPayload({ config });
		const ids = await resolveRouteFilterIds(filters);
		const result = await payload.find({
			collection: "routes",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 1,
			page: filters.page ?? 1,
			limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
			sort: ["sortOrder", "title"],
			where: buildRouteWhere(filters, ids)
		});
		return {
			docs: result.docs,
			totalDocs: result.totalDocs,
			page: result.page ?? 1,
			totalPages: result.totalPages,
			hasNextPage: result.hasNextPage,
			hasPrevPage: result.hasPrevPage
		};
	} catch {
		return {
			docs: [],
			totalDocs: 0,
			page: 1,
			totalPages: 0,
			hasNextPage: false,
			hasPrevPage: false
		};
	}
}
const getCachedRoutes = unstable_cache(fetchRoutes, ["routes-list"], {
	revalidate: 60
});
export const findRoutes = cache(
	async (
		locale: string,
		filters: TRouteListFilters = {}
	): Promise<TDiscoveryListResult<Route>> => {
		return getCachedRoutes(locale, JSON.stringify(filters));
	}
);
export const findFeaturedRoutes = cache(
	async (locale: string, limit = 3): Promise<Route[]> => {
		const result = await findRoutes(locale, { featured: true, limit });
		return result.docs;
	}
);
