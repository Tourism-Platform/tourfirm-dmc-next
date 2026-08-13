import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import { GEO_FINDER_CACHE_VERSION } from "./geo-page-query";
import { GEO_REF_DEPTH, GEO_REF_SELECT } from "./geo-ref-query";
import type { Region } from "@/payload-types";

/** Slug is unique — no country filter (enables parallel parent lookups). */
async function fetchRegionRefBySlug(
	locale: string,
	regionSlug: string
): Promise<Region | null> {
	try {
		const payload = await getPayload({ config });
		const geoLocale = toGeoLocale(locale);
		const result = await payload.find({
			collection: "regions",
			locale: geoLocale,
			fallbackLocale: "en",
			depth: GEO_REF_DEPTH,
			limit: 1,
			select: GEO_REF_SELECT,
			where: {
				and: [
					{ slug: { equals: regionSlug } },
					{ _status: { equals: "published" } }
				]
			}
		});
		return (result.docs[0] as Region | undefined) ?? null;
	} catch {
		return null;
	}
}
const getCachedRegionRefBySlug = unstable_cache(
	fetchRegionRefBySlug,
	[`region-ref-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);
export const findRegionRefBySlug = cache(
	async (locale: string, regionSlug: string): Promise<Region | null> => {
		return getCachedRegionRefBySlug(locale, regionSlug);
	}
);
