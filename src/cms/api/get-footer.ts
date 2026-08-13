import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import {
	LAYOUT_GLOBAL_CACHE_VERSION,
	LAYOUT_NAV_PAGE_DEPTH,
	LAYOUT_NAV_PAGE_SELECT,
	collectFooterPageIds,
	hydrateFooterNavDocs
} from "./hydrate-layout-nav-docs";
import { FOOTER_CACHE_TAG } from "@/cms/cache/cache-tags";
import type { Footer, Page } from "@/payload-types";

async function fetchFooter(locale: TypedLocale): Promise<Footer | null> {
	try {
		const payload = await getPayload({ config });
		const doc = await payload.findGlobal({
			slug: "footer",
			locale,
			depth: 0,
			fallbackLocale: "en"
		});
		if (!doc) {
			return null;
		}
		const pageIds = collectFooterPageIds(doc);
		const pagesResult =
			pageIds.length > 0
				? await payload.find({
						collection: "pages",
						locale,
						fallbackLocale: "en",
						depth: LAYOUT_NAV_PAGE_DEPTH,
						limit: pageIds.length,
						where: { id: { in: pageIds } },
						select: LAYOUT_NAV_PAGE_SELECT
					})
				: { docs: [] as Page[] };
		return hydrateFooterNavDocs(doc, pagesResult.docs as Page[]);
	} catch {
		return null;
	}
}
const getCachedFooter = unstable_cache(
	fetchFooter,
	[`footer-global-${LAYOUT_GLOBAL_CACHE_VERSION}`],
	{
		tags: [FOOTER_CACHE_TAG],
		revalidate: 60
	}
);
export const getFooter = cache(
	async (locale: TypedLocale): Promise<Footer | null> => {
		return getCachedFooter(locale);
	}
);
