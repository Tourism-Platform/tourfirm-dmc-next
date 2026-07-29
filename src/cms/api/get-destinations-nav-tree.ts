import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { TDestinationsNavTree } from "@/shared/types/destinations-nav.types";

import { toGeoLocale } from "./geo-locale";
import { DESTINATIONS_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";
import { buildDestinationsNavTree } from "@/cms/lib/build-destinations-nav-tree";
import { PUBLISHED_AND_SHOW_IN_HEADER } from "@/cms/lib/nav-visibility-where";
import type { City, Country, Region } from "@/payload-types";

const JOIN_LIMIT = 500;

function extractJoinDocs<T extends { id: number }>(
	docs: (number | T)[] | null | undefined
): T[] {
	if (!docs?.length) {
		return [];
	}

	return docs.filter((doc): doc is T => typeof doc !== "number");
}

async function fetchDestinationsNavTree(
	locale: string,
	rootSlug: string
): Promise<TDestinationsNavTree> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);

	const result = await payload.find({
		collection: "countries",
		locale: geoLocale,
		fallbackLocale: "en",
		depth: 1,
		where: PUBLISHED_AND_SHOW_IN_HEADER,
		limit: 100,
		select: {
			slug: true,
			title: true,
			navOrder: true,
			badges: true,
			regions: true,
			cities: true
		},
		joins: {
			regions: {
				limit: JOIN_LIMIT,
				sort: "navOrder",
				where: PUBLISHED_AND_SHOW_IN_HEADER
			},
			cities: {
				limit: JOIN_LIMIT,
				sort: "navOrder",
				where: PUBLISHED_AND_SHOW_IN_HEADER
			}
		}
	});

	const countries = result.docs as Country[];
	const regions: Region[] = [];
	const cities: City[] = [];

	for (const country of countries) {
		regions.push(...extractJoinDocs<Region>(country.regions?.docs));
		cities.push(...extractJoinDocs<City>(country.cities?.docs));
	}

	return buildDestinationsNavTree(rootSlug, countries, regions, cities);
}

const getCachedDestinationsNavTree = unstable_cache(
	fetchDestinationsNavTree,
	["destinations-nav-tree"],
	{
		tags: [DESTINATIONS_NAV_CACHE_TAG],
		revalidate: 60
	}
);

export const getDestinationsNavTree = cache(
	async (locale: string, rootSlug: string): Promise<TDestinationsNavTree> => {
		return getCachedDestinationsNavTree(locale, rootSlug);
	}
);
