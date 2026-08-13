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
import { LEAN_SELECT, hydrateLeanCardDocs } from "./hydrate-discovery-page-doc";
import { auditSpan } from "@/cms/perf/audit-span";
import type { Route } from "@/payload-types";

async function lookupRouteFilterId(
	collection: "themes" | "countries",
	slug: string
): Promise<number | undefined> {
	const payload = await getPayload({ config });
	const result = await auditSpan(
		`resolveFilterIds.lookup.${collection}`,
		{ slug, caller: "routes" },
		() =>
			payload.find({
				collection,
				where: { slug: { equals: slug } },
				limit: 1,
				depth: 0,
				locale: "en"
			})
	);
	const id = result.docs[0]?.id;
	return typeof id === "number" ? id : undefined;
}

async function resolveRouteFilterIds(filters: TRouteListFilters): Promise<{
	themeId?: number;
	countryId?: number;
}> {
	if (typeof filters.themeId === "number" && !filters.country) {
		return { themeId: filters.themeId };
	}

	const [themeId, countryId] = await Promise.all([
		typeof filters.themeId === "number"
			? Promise.resolve(filters.themeId)
			: filters.theme
				? lookupRouteFilterId("themes", filters.theme)
				: Promise.resolve(undefined),
		filters.country
			? lookupRouteFilterId("countries", filters.country)
			: Promise.resolve(undefined)
	]);

	return {
		...(themeId != null ? { themeId } : {}),
		...(countryId != null ? { countryId } : {})
	};
}
function buildRouteWhere(
	filters: TRouteListFilters,
	ids: {
		themeId?: number;
		countryId?: number;
	}
): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];
	if (ids.themeId) {
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
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchRoutes", locale },
			() => getPayload({ config })
		);
		const ids = await auditSpan("resolveFilterIds:routes", { locale }, () =>
			resolveRouteFilterIds(filters)
		);
		const lean = Boolean(filters.lean);
		const depth = lean ? 0 : 1;
		const result = await auditSpan(
			"payload.find:routes",
			{
				locale,
				depth,
				lean,
				page: filters.page ?? 1,
				limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT
			},
			() =>
				payload.find({
					collection: "routes",
					locale: toGeoLocale(locale),
					fallbackLocale: "en",
					depth,
					page: filters.page ?? 1,
					limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
					sort: ["sortOrder", "title"],
					where: buildRouteWhere(filters, ids),
					...(lean ? { select: LEAN_SELECT.routes } : {})
				})
		);
		const docs = lean
			? await auditSpan(
					"hydrateLeanCardDocs:routes",
					{ locale, count: result.docs.length },
					() =>
						hydrateLeanCardDocs(
							payload,
							locale,
							result.docs as unknown as Record<string, unknown>[]
						)
				)
			: result.docs;
		return {
			docs: docs as unknown as Route[],
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
		return auditSpan("findRoutes", { locale, layer: "react+data" }, () =>
			getCachedRoutes(locale, JSON.stringify(filters))
		);
	}
);
export const findFeaturedRoutes = cache(
	async (locale: string, limit = 3): Promise<Route[]> => {
		const result = await findRoutes(locale, { featured: true, limit });
		return result.docs;
	}
);
