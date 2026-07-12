import config from "@payload-config";
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

export const findNews = cache(
	async (
		locale: string,
		filters: TNewsListFilters = {}
	): Promise<TDiscoveryListResult<News>> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "news",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 1,
				page: filters.page ?? 1,
				limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
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
);

export const findFeaturedNews = cache(
	async (locale: string, limit = 3): Promise<News[]> => {
		const result = await findNews(locale, { featured: true, limit });
		return result.docs;
	}
);
