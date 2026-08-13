import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { GEO_FINDER_CACHE_VERSION } from "./geo-page-query";
import { DESTINATION_GLOBAL_CACHE_TAG } from "@/cms/cache/cache-tags";

type TLocale = "en" | "ru" | "uz";
type TDestinationSlug = {
	slug: string;
};
async function fetchDestinationSlug(
	locale: string
): Promise<TDestinationSlug | null> {
	try {
		const payload = await getPayload({ config });
		const doc = await payload.findGlobal({
			slug: "destination",
			locale: locale as TLocale,
			depth: 0,
			select: { slug: true },
			fallbackLocale: "en"
		});
		const slug =
			doc && typeof doc === "object" && "slug" in doc
				? String(
						(
							doc as {
								slug?: string;
							}
						).slug ?? ""
					).trim()
				: "";
		if (!slug) {
			return null;
		}
		return { slug };
	} catch {
		return null;
	}
}
const getCachedDestinationSlug = unstable_cache(
	fetchDestinationSlug,
	[`destination-slug-${GEO_FINDER_CACHE_VERSION}`],
	{
		tags: [DESTINATION_GLOBAL_CACHE_TAG],
		revalidate: 60
	}
);
/** Nav-root slug only — use on geo/layout paths that must not load destination blocks. */
export const getDestinationSlug = cache(
	async (locale: string): Promise<TDestinationSlug | null> => {
		return getCachedDestinationSlug(locale);
	}
);
