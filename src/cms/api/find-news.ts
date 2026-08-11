import config from "@payload-config";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DISCOVERY_LIST_DEFAULT_LIMIT,
	type TDiscoveryListResult,
	type TNewsListFilters
} from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import type { News } from "@/payload-types";

function buildNewsWhere(filters: TNewsListFilters): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];

	if (filters.featured) {
		and.push({ featured: { equals: true } });
	}

	return { and };
}

async function fetchNews(
	locale: string,
	page: number,
	limit: number,
	featured: boolean
): Promise<TDiscoveryListResult<News>> {
	try {
		const payload = await getPayload({ config });
		const filters: TNewsListFilters = {
			page,
			limit,
			...(featured ? { featured: true } : {})
		};

		const result = await payload.find({
			collection: "news",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 1,
			page,
			limit,
			sort: ["sortOrder", "-publishDate", "title"],
			where: buildNewsWhere(filters)
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

const getCachedNews = unstable_cache(fetchNews, ["news-list"], {
	revalidate: 60
});

export const findNews = cache(
	async (
		locale: string,
		filters: TNewsListFilters = {}
	): Promise<TDiscoveryListResult<News>> => {
		return getCachedNews(
			locale,
			filters.page ?? 1,
			filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
			Boolean(filters.featured)
		);
	}
);

export const findFeaturedNews = cache(
	async (locale: string, limit = 3): Promise<News[]> => {
		const result = await findNews(locale, { featured: true, limit });
		return result.docs;
	}
);
