import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import { GEO_FINDER_CACHE_VERSION } from "./geo-page-query";
import { GEO_REF_DEPTH, GEO_REF_SELECT } from "./geo-ref-query";
import type { Country } from "@/payload-types";

async function fetchCountryRefBySlug(
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
			depth: GEO_REF_DEPTH,
			limit: 1,
			select: GEO_REF_SELECT,
			where: {
				and: [
					{ slug: { equals: slug } },
					{ _status: { equals: "published" } }
				]
			}
		});
		return (result.docs[0] as Country | undefined) ?? null;
	} catch {
		return null;
	}
}
const getCachedCountryRefBySlug = unstable_cache(
	fetchCountryRefBySlug,
	[`country-ref-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);
export const findCountryRefBySlug = cache(
	async (locale: string, slug: string): Promise<Country | null> => {
		return getCachedCountryRefBySlug(locale, slug);
	}
);
