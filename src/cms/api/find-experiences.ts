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
import { LEAN_SELECT, hydrateLeanCardDocs } from "./hydrate-discovery-page-doc";
import { auditSpan } from "@/cms/perf/audit-span";
import type { Experience } from "@/payload-types";

async function lookupFilterId(
	collection: "themes" | "countries" | "cities",
	slug: string
): Promise<number | undefined> {
	const payload = await getPayload({ config });
	const result = await auditSpan(
		`resolveFilterIds.lookup.${collection}`,
		{ slug },
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

async function resolveFilterIds(filters: TExperienceListFilters): Promise<{
	themeId?: number;
	countryId?: number;
	cityId?: number;
}> {
	if (
		typeof filters.themeId === "number" &&
		!filters.country &&
		!filters.city
	) {
		return { themeId: filters.themeId };
	}

	const [themeId, countryId, cityId] = await Promise.all([
		typeof filters.themeId === "number"
			? Promise.resolve(filters.themeId)
			: filters.theme
				? lookupFilterId("themes", filters.theme)
				: Promise.resolve(undefined),
		filters.country
			? lookupFilterId("countries", filters.country)
			: Promise.resolve(undefined),
		filters.city
			? lookupFilterId("cities", filters.city)
			: Promise.resolve(undefined)
	]);

	return {
		...(themeId != null ? { themeId } : {}),
		...(countryId != null ? { countryId } : {}),
		...(cityId != null ? { cityId } : {})
	};
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
	if (ids.themeId) {
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
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchExperiences", locale },
			() => getPayload({ config })
		);
		const ids = await auditSpan(
			"resolveFilterIds:experiences",
			{ locale, filtersKey: Object.keys(filters).join(",") },
			() => resolveFilterIds(filters)
		);
		const lean = Boolean(filters.lean);
		const depth = lean ? 0 : 1;
		const result = await auditSpan(
			"payload.find:experiences",
			{
				locale,
				depth,
				lean,
				page: filters.page ?? 1,
				limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT
			},
			() =>
				payload.find({
					collection: "experiences",
					locale: toGeoLocale(locale),
					fallbackLocale: "en",
					depth,
					page: filters.page ?? 1,
					limit: filters.limit ?? DISCOVERY_LIST_DEFAULT_LIMIT,
					sort: ["sortOrder", "title"],
					where: buildExperienceWhere(filters, ids),
					...(lean ? { select: LEAN_SELECT.experiences } : {})
				})
		);
		const docs = lean
			? await auditSpan(
					"hydrateLeanCardDocs:experiences",
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
			docs: docs as unknown as Experience[],
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
		return auditSpan(
			"findExperiences",
			{ locale, layer: "react+data" },
			() => getCachedExperiences(locale, JSON.stringify(filters))
		);
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
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchSimilarExperiences", locale, experienceId },
			() => getPayload({ config })
		);
		const result = await auditSpan(
			"payload.find:similarExperiences",
			{
				locale,
				experienceId,
				depth: 0,
				limit,
				themeCount: themeIds.length
			},
			() =>
				payload.find({
					collection: "experiences",
					locale: toGeoLocale(locale),
					fallbackLocale: "en",
					depth: 0,
					limit,
					select: LEAN_SELECT.experiences,
					where: {
						and: [
							{ _status: { equals: "published" } },
							{ id: { not_equals: experienceId } },
							{ themes: { in: themeIds } }
						]
					}
				})
		);
		const docs = await auditSpan(
			"hydrateLeanCardDocs:similarExperiences",
			{ locale, count: result.docs.length },
			() =>
				hydrateLeanCardDocs(
					payload,
					locale,
					result.docs as unknown as Record<string, unknown>[]
				)
		);
		return docs as unknown as Experience[];
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
		return auditSpan(
			"findSimilarExperiences",
			{
				locale,
				experienceId,
				themeCount: themeIds.length,
				layer: "react+data"
			},
			() =>
				getCachedSimilarExperiences(
					locale,
					experienceId,
					JSON.stringify(themeIds),
					limit
				)
		);
	}
);
