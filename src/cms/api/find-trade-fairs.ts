import config from "@payload-config";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DISCOVERY_LIST_DEFAULT_LIMIT,
	type TDiscoveryListResult,
	type TTradeFairListFilters
} from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import type { TradeFair } from "@/payload-types";

function buildTradeFairWhere(filters: TTradeFairListFilters): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];
	if (filters.featured) {
		and.push({ featured: { equals: true } });
	}
	return { and };
}
async function fetchTradeFairs(
	locale: string,
	page: number,
	limit: number,
	featured: boolean
): Promise<TDiscoveryListResult<TradeFair>> {
	try {
		const payload = await getPayload({ config });
		const filters: TTradeFairListFilters = {
			page,
			limit,
			...(featured ? { featured: true } : {})
		};
		const result = await payload.find({
			collection: "trade-fairs",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 1,
			page,
			limit,
			sort: ["sortOrder", "title"],
			where: buildTradeFairWhere(filters)
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
const getCachedTradeFairs = unstable_cache(
	fetchTradeFairs,
	["trade-fairs-list"],
	{ revalidate: 60 }
);
export const findTradeFairs = cache(
	async (
		locale: string,
		filters: TTradeFairListFilters = {}
	): Promise<TDiscoveryListResult<TradeFair>> => {
		return getCachedTradeFairs(
			locale,
			filters.page ?? 1,
			filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
			Boolean(filters.featured)
		);
	}
);
export const findFeaturedTradeFairs = cache(
	async (locale: string, limit = 3): Promise<TradeFair[]> => {
		const result = await findTradeFairs(locale, { featured: true, limit });
		return result.docs;
	}
);
