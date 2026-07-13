import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";

import { toGeoLocale } from "./geo-locale";
import { ROUTES_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";
import { buildRoutesNavTree } from "@/cms/lib/build-discovery-nav-tree";

const PUBLISHED_WHERE = {
	_status: {
		equals: "published" as const
	}
};

async function fetchRoutesNavTree(locale: string): Promise<TDiscoveryNavTree> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);

	const result = await payload.find({
		collection: "routes",
		locale: geoLocale,
		fallbackLocale: "en",
		depth: 0,
		where: PUBLISHED_WHERE,
		limit: 200,
		sort: "sortOrder",
		select: {
			slug: true,
			title: true,
			subtitle: true,
			sortOrder: true
		}
	});

	return buildRoutesNavTree(
		result.docs.map((doc) => ({
			id: doc.id,
			slug: doc.slug,
			title: doc.title,
			subtitle: doc.subtitle
		}))
	);
}

const getCachedRoutesNavTree = unstable_cache(
	fetchRoutesNavTree,
	["routes-nav-tree"],
	{
		tags: [ROUTES_NAV_CACHE_TAG],
		revalidate: 60
	}
);

export const getRoutesNavTree = cache(
	async (locale: string): Promise<TDiscoveryNavTree> => {
		return getCachedRoutesNavTree(locale);
	}
);
