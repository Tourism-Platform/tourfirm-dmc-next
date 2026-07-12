import config from "@payload-config";
import type { Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DISCOVERY_LIST_DEFAULT_LIMIT,
	type TBlogListFilters,
	type TDiscoveryListResult
} from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import type { Blog } from "@/payload-types";

function buildBlogWhere(filters: TBlogListFilters): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];

	if (filters.featured) {
		and.push({ featured: { equals: true } });
	}

	return { and };
}

export const findBlogPosts = cache(
	async (
		locale: string,
		filters: TBlogListFilters = {}
	): Promise<TDiscoveryListResult<Blog>> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "blog",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 1,
				page: filters.page ?? 1,
				limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
				sort: ["sortOrder", "title"],
				where: buildBlogWhere(filters)
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

export const findFeaturedBlogPosts = cache(
	async (locale: string, limit = 3): Promise<Blog[]> => {
		const result = await findBlogPosts(locale, { featured: true, limit });
		return result.docs;
	}
);
