import type { TRouteAdapter } from "./types/route-adapter.types";
import type { TRouteDependencies } from "./types/route-dependencies.types";
import { findCollectionDocuments } from "@/cms/api/find-collection-documents";
import {
	findExperiences,
	findSimilarExperiences
} from "@/cms/api/find-experiences";
import { findNews } from "@/cms/api/find-news";
import { findRoutes } from "@/cms/api/find-routes";
import { findTradeFairs } from "@/cms/api/find-trade-fairs";
import { getExperienceThemeIds } from "@/cms/lib/map-discovery-cards";
import type { Experience } from "@/payload-types";

const standardAdapter: TRouteAdapter = {
	key: "standard",
	resolveList: async ({ locale, runtime, searchParams }) => {
		const collection = runtime.data.collection;

		if (!collection) {
			return {
				docs: [],
				totalDocs: 0,
				page: 1,
				totalPages: 0,
				hasNextPage: false,
				hasPrevPage: false
			};
		}

		if (collection === "trade-fairs") {
			return findTradeFairs(locale, {
				page: searchParams?.page ? Number(searchParams.page) : undefined
			});
		}

		return findCollectionDocuments({
			collection,
			locale,
			page: searchParams?.page ? Number(searchParams.page) : 1
		});
	}
};

const newsAdapter: TRouteAdapter = {
	key: "news",
	resolveList: async ({ locale, searchParams }) =>
		findNews(locale, {
			page: searchParams?.page ? Number(searchParams.page) : undefined
		})
};

const routesAdapter: TRouteAdapter = {
	key: "routes",
	resolveList: async ({ locale, searchParams }) =>
		findRoutes(locale, {
			page: searchParams?.page ? Number(searchParams.page) : undefined,
			theme: searchParams?.theme,
			country: searchParams?.country
		})
};

const experiencesAdapter: TRouteAdapter = {
	key: "experiences",
	resolveList: async ({ locale, searchParams }) =>
		findExperiences(locale, {
			page: searchParams?.page ? Number(searchParams.page) : undefined,
			theme: searchParams?.theme,
			country: searchParams?.country
		}),
	resolveDependencies: async ({ locale, entityResult }) => {
		const experience = entityResult.rawDocument as Experience | null;

		if (!experience || typeof experience.id !== "number") {
			return {};
		}

		return {
			similarExperiences: await findSimilarExperiences(
				locale,
				experience.id,
				getExperienceThemeIds(experience)
			)
		};
	}
};

const themesAdapter: TRouteAdapter = {
	key: "themes",
	resolveDependencies: async ({ locale, entityResult }) => {
		const theme = entityResult.rawDocument as {
			slug?: string;
			id?: number;
		} | null;
		const slug = theme?.slug;
		const themeId = typeof theme?.id === "number" ? theme.id : undefined;

		if (!slug && themeId == null) {
			return {};
		}

		const filters = {
			...(slug ? { theme: slug } : {}),
			...(themeId != null ? { themeId } : {}),
			limit: 12,
			lean: true as const
		};

		const [routesResult, experiencesResult] = await Promise.all([
			findRoutes(locale, filters),
			findExperiences(locale, filters)
		]);

		return {
			themeRoutes: routesResult.docs,
			themeExperiences: experiencesResult.docs
		} satisfies TRouteDependencies;
	}
};

export const ROUTE_ADAPTER_REGISTRY: Record<string, TRouteAdapter> = {
	standard: standardAdapter,
	news: newsAdapter,
	routes: routesAdapter,
	experiences: experiencesAdapter,
	themes: themesAdapter
};

export function getRouteAdapter(
	adapterKey?: string
): TRouteAdapter | undefined {
	if (!adapterKey) {
		return undefined;
	}

	return ROUTE_ADAPTER_REGISTRY[adapterKey];
}
