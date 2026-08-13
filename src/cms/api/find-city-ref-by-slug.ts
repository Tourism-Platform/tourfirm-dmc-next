import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import { GEO_FINDER_CACHE_VERSION } from "./geo-page-query";
import { GEO_REF_DEPTH, GEO_REF_SELECT } from "./geo-ref-query";
import type { City } from "@/payload-types";

/** Slug is unique — no country/region filter (enables parallel parent lookups). */
async function fetchCityRefBySlug(
	locale: string,
	citySlug: string
): Promise<City | null> {
	try {
		const payload = await getPayload({ config });
		const geoLocale = toGeoLocale(locale);
		const result = await payload.find({
			collection: "cities",
			locale: geoLocale,
			fallbackLocale: "en",
			depth: GEO_REF_DEPTH,
			limit: 1,
			select: GEO_REF_SELECT,
			where: {
				and: [
					{ slug: { equals: citySlug } },
					{ _status: { equals: "published" } }
				]
			}
		});
		return (result.docs[0] as City | undefined) ?? null;
	} catch {
		return null;
	}
}
const getCachedCityRefBySlug = unstable_cache(
	fetchCityRefBySlug,
	[`city-ref-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);
export const findCityRefBySlug = cache(
	async (locale: string, citySlug: string): Promise<City | null> => {
		return getCachedCityRefBySlug(locale, citySlug);
	}
);
