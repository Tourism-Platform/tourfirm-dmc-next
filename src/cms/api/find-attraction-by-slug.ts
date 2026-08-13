import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import {
	GEO_FINDER_CACHE_VERSION,
	GEO_PAGE_DEPTH,
	GEO_PAGE_SELECT
} from "./geo-page-query";
import { hydrateGeoPageDoc } from "./hydrate-geo-page-doc";
import type { Attraction } from "@/payload-types";

async function fetchAttractionBySlug(
	locale: string,
	cityId: number,
	attractionSlug: string
): Promise<Attraction | null> {
	try {
		const payload = await getPayload({ config });
		const geoLocale = toGeoLocale(locale);

		const result = await payload.find({
			collection: "attractions",
			locale: geoLocale,
			fallbackLocale: "en",
			depth: GEO_PAGE_DEPTH,
			limit: 1,
			select: GEO_PAGE_SELECT,
			where: {
				and: [
					{ slug: { equals: attractionSlug } },
					{ city: { equals: cityId } },
					{ _status: { equals: "published" } }
				]
			}
		});

		const doc = result.docs[0] as Attraction | undefined;
		if (!doc) {
			return null;
		}

		return (await hydrateGeoPageDoc(
			payload,
			geoLocale,
			doc as unknown as Record<string, unknown>
		)) as unknown as Attraction;
	} catch {
		return null;
	}
}

const getCachedAttractionBySlug = unstable_cache(
	fetchAttractionBySlug,
	[`attraction-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);

export const findAttractionBySlug = cache(
	async (
		locale: string,
		cityId: number,
		attractionSlug: string
	): Promise<Attraction | null> => {
		return getCachedAttractionBySlug(locale, cityId, attractionSlug);
	}
);
