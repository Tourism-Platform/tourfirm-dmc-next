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
import type { Page } from "@/payload-types";

async function fetchPageBySlug(
	locale: string,
	slug: string
): Promise<Page | null> {
	try {
		const payload = await getPayload({ config });
		const geoLocale = toGeoLocale(locale);
		const result = await payload.find({
			collection: "pages",
			locale: geoLocale,
			fallbackLocale: "en",
			depth: GEO_PAGE_DEPTH,
			limit: 1,
			select: GEO_PAGE_SELECT,
			where: {
				and: [
					{ slug: { equals: slug } },
					{ segment: { exists: false } },
					{ _status: { equals: "published" } }
				]
			}
		});
		const doc = result.docs[0] as Page | undefined;
		if (!doc) {
			return null;
		}
		return (await hydrateGeoPageDoc(
			payload,
			geoLocale,
			doc as unknown as Record<string, unknown>
		)) as unknown as Page;
	} catch {
		return null;
	}
}
const getCachedPageBySlug = unstable_cache(
	fetchPageBySlug,
	[`page-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);
export const findPageBySlug = cache(
	async (locale: string, slug: string): Promise<Page | null> => {
		return getCachedPageBySlug(locale, slug);
	}
);
