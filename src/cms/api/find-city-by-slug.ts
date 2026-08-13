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
import { auditSpan } from "@/cms/perf/audit-span";
import type { City } from "@/payload-types";

async function fetchCityBySlug(
	locale: string,
	citySlug: string
): Promise<City | null> {
	try {
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchCityBySlug", locale, slug: citySlug },
			() => getPayload({ config })
		);
		const geoLocale = toGeoLocale(locale);

		const result = await auditSpan(
			"payload.find:cityBySlug",
			{ locale, slug: citySlug, depth: GEO_PAGE_DEPTH },
			() =>
				payload.find({
					collection: "cities",
					locale: geoLocale,
					fallbackLocale: "en",
					depth: GEO_PAGE_DEPTH,
					limit: 1,
					select: GEO_PAGE_SELECT,
					where: {
						and: [
							{ slug: { equals: citySlug } },
							{ _status: { equals: "published" } }
						]
					}
				})
		);

		const doc = result.docs[0] as City | undefined;
		if (!doc) {
			return null;
		}

		return (await auditSpan(
			"hydrateGeoPageDoc",
			{ locale, collection: "cities", caller: "fetchCityBySlug" },
			() =>
				hydrateGeoPageDoc(
					payload,
					geoLocale,
					doc as unknown as Record<string, unknown>
				)
		)) as unknown as City;
	} catch {
		return null;
	}
}

const getCachedCityBySlug = unstable_cache(
	fetchCityBySlug,
	[`city-by-slug-${GEO_FINDER_CACHE_VERSION}`],
	{ revalidate: 60 }
);

export const findCityBySlug = cache(
	async (locale: string, citySlug: string): Promise<City | null> => {
		return auditSpan(
			"findCityBySlug",
			{ locale, slug: citySlug, layer: "react+data" },
			() => getCachedCityBySlug(locale, citySlug)
		);
	}
);
