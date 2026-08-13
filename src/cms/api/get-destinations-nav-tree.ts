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

const DESTINATIONS_NAV_CACHE_VERSION = "v2-lean-select";
const LIST_LIMIT = 500;
async function fetchDestinationsNavTree(
	locale: string,
	rootSlug: string
): Promise<TDestinationsNavTree> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);
	const shared = {
		locale: geoLocale,
		fallbackLocale: "en" as const,
		where: PUBLISHED_AND_SHOW_IN_HEADER,
		joins: false as const
	};
	const [countriesResult, regionsResult, citiesResult] = await Promise.all([
		payload.find({
			...shared,
			collection: "countries",
			depth: 1,
			limit: 100,
			select: {
				slug: true,
				title: true,
				navOrder: true,
				badges: true
			}
		}),
		payload.find({
			...shared,
			collection: "regions",
			depth: 0,
			limit: LIST_LIMIT,
			select: {
				slug: true,
				title: true,
				navOrder: true,
				badges: true,
				country: true
			}
		}),
		payload.find({
			...shared,
			collection: "cities",
			depth: 0,
			limit: LIST_LIMIT,
			select: {
				slug: true,
				title: true,
				navOrder: true,
				badges: true,
				region: true
			}
		})
	]);
	return buildDestinationsNavTree(
		rootSlug,
		countriesResult.docs as Country[],
		regionsResult.docs as Region[],
		citiesResult.docs as City[]
	);
}
const getCachedDestinationsNavTree = unstable_cache(
	fetchDestinationsNavTree,
	[`destinations-nav-tree-${DESTINATIONS_NAV_CACHE_VERSION}`],
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
