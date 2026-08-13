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
import type { Country } from "@/payload-types";

async function fetchCountryBySlug(
	locale: string,
	slug: string
): Promise<Country | null> {
	try {
		const payload = await getPayload({ config });
		const geoLocale = toGeoLocale(locale);

		const result = await payload.find({
			collection: "countries",
			locale: geoLocale,
			fallbackLocale: "en",
			depth: GEO_PAGE_DEPTH,
			limit: 1,
			select: GEO_PAGE_SELECT,
			where: {
				and: [
					{ slug: { equals: slug } },
					{ _status: { equals: "published" } }
				]
			}
		});

		const doc = result.docs[0] as Country | undefined;
		if (!doc) {
			return null;
		}

		return (await hydrateGeoPageDoc(
			payload,
			geoLocale,
			doc as unknown as Record<string, unknown>
		)) as unknown as Country;
	} catch {
		return null;
	}
}

const getCachedCountryBySlug = unstable_cache(
	fetchCountryBySlug,
	[`country-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);

export const findCountryBySlug = cache(
	async (locale: string, slug: string): Promise<Country | null> => {
		return getCachedCountryBySlug(locale, slug);
	}
);
