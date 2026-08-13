import config from "@payload-config";
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DISCOVERY_LIST_DEFAULT_LIMIT,
	type TDiscoveryListResult,
	type TExperienceListFilters
} from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import type { Experience } from "@/payload-types";

async function resolveFilterIds(filters: TExperienceListFilters): Promise<{
	themeId?: number;
	countryId?: number;
	cityId?: number;
}> {
	const payload = await getPayload({ config });
	const result: {
		themeId?: number;
		countryId?: number;
		cityId?: number;
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
	if (filters.city) {
		const cityResult = await payload.find({
			collection: "cities",
			where: { slug: { equals: filters.city } },
			limit: 1,
			depth: 0,
			locale: "en"
		});
		const cityId = cityResult.docs[0]?.id;
		if (typeof cityId === "number") {
			result.cityId = cityId;
		}
	}
	return result;
}
function buildExperienceWhere(
	filters: TExperienceListFilters,
	ids: {
		themeId?: number;
		countryId?: number;
		cityId?: number;
	}
): Where {
	const and: Where[] = [{ _status: { equals: "published" } }];
	if (filters.theme && ids.themeId) {
		and.push({ themes: { contains: ids.themeId } });
	}
	if (filters.country && ids.countryId) {
		and.push({ country: { equals: ids.countryId } });
	}
	if (filters.city && ids.cityId) {
		and.push({ city: { equals: ids.cityId } });
	}
	if (filters.type) {
		and.push({ type: { equals: filters.type } });
	}
	if (filters.featured) {
		and.push({ featured: { equals: true } });
	}
	return { and };
}
async function fetchExperiences(
	locale: string,
	filtersKey: string
): Promise<TDiscoveryListResult<Experience>> {
	const filters = JSON.parse(filtersKey) as TExperienceListFilters;
	try {
		const payload = await getPayload({ config });
		const ids = await resolveFilterIds(filters);
		const result = await payload.find({
			collection: "experiences",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 1,
			page: filters.page ?? 1,
			limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
			sort: ["sortOrder", "title"],
			where: buildExperienceWhere(filters, ids)
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
const getCachedExperiences = unstable_cache(
	fetchExperiences,
	["experiences-list"],
	{ revalidate: 60 }
);
export const findExperiences = cache(
	async (
		locale: string,
		filters: TExperienceListFilters = {}
	): Promise<TDiscoveryListResult<Experience>> => {
		return getCachedExperiences(locale, JSON.stringify(filters));
	}
);
export const findFeaturedExperiences = cache(
	async (locale: string, limit = 6): Promise<Experience[]> => {
		const result = await findExperiences(locale, { featured: true, limit });
		return result.docs;
	}
);
async function fetchSimilarExperiences(
	locale: string,
	experienceId: number,
	themeIdsKey: string,
	limit: number
): Promise<Experience[]> {
	const themeIds = JSON.parse(themeIdsKey) as number[];
	if (themeIds.length === 0) {
		return [];
	}
	try {
		const payload = await getPayload({ config });
		const result = await payload.find({
			collection: "experiences",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 1,
			limit,
			where: {
				and: [
					{ _status: { equals: "published" } },
					{ id: { not_equals: experienceId } },
					{ themes: { in: themeIds } }
				]
			}
		});
		return result.docs;
	} catch {
		return [];
	}
}
const getCachedSimilarExperiences = unstable_cache(
	fetchSimilarExperiences,
	["similar-experiences"],
	{ revalidate: 60 }
);
export const findSimilarExperiences = cache(
	async (
		locale: string,
		experienceId: number,
		themeIds: number[],
		limit = 4
	): Promise<Experience[]> => {
		return getCachedSimilarExperiences(
			locale,
			experienceId,
			JSON.stringify(themeIds),
			limit
		);
	}
);
