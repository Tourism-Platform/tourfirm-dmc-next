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
	collectHeaderMediaIds,
	collectHeaderPageIds,
	hydrateHeaderNavDocs
} from "./hydrate-layout-nav-docs";
import { HEADER_CACHE_TAG } from "@/cms/cache/cache-tags";
import type { Header, Media, Page } from "@/payload-types";

async function fetchHeader(locale: TypedLocale): Promise<Header | null> {
	try {
		const payload = await getPayload({ config });
		const doc = await payload.findGlobal({
			slug: "header",
			locale,
			depth: 0,
			fallbackLocale: "en"
		});
		if (!doc) {
			return null;
		}
		const pageIds = collectHeaderPageIds(doc);
		const mediaIds = collectHeaderMediaIds(doc);
		const [pagesResult, mediaResult] = await Promise.all([
			pageIds.length > 0
				? payload.find({
						collection: "pages",
						locale,
						fallbackLocale: "en",
						depth: LAYOUT_NAV_PAGE_DEPTH,
						limit: pageIds.length,
						where: { id: { in: pageIds } },
						select: LAYOUT_NAV_PAGE_SELECT
					})
				: Promise.resolve({ docs: [] as Page[] }),
			mediaIds.length > 0
				? payload.find({
						collection: "media",
						depth: 0,
						limit: mediaIds.length,
						where: { id: { in: mediaIds } }
					})
				: Promise.resolve({ docs: [] as Media[] })
		]);
		return hydrateHeaderNavDocs(
			doc,
			pagesResult.docs as Page[],
			mediaResult.docs as Media[]
		);
	} catch {
		return null;
	}
}
const getCachedHeader = unstable_cache(
	fetchHeader,
	[`header-global-${LAYOUT_GLOBAL_CACHE_VERSION}`],
	{
		tags: [HEADER_CACHE_TAG],
		revalidate: 60
	}
);
export const getHeader = cache(
	async (locale: TypedLocale): Promise<Header | null> => {
		return getCachedHeader(locale);
	}
);
