import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Page } from "@/payload-types";

async function fetchPageBySegmentAndSlug(
	locale: string,
	segmentId: number,
	pageSlug: string
): Promise<Page | null> {
	try {
		const payload = await getPayload({ config });
		const result = await payload.find({
			collection: "pages",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 2,
			limit: 1,
			where: {
				and: [
					{ slug: { equals: pageSlug } },
					{ segment: { equals: segmentId } },
					{ pathGroup: { exists: false } },
					{ _status: { equals: "published" } }
				]
			}
		});
		return result.docs[0] ?? null;
	} catch {
		return null;
	}
}
const getCachedPageBySegmentAndSlug = unstable_cache(
	fetchPageBySegmentAndSlug,
	["page-by-segment-slug"],
	{ revalidate: 60 }
);
export const findPageBySegmentAndSlug = cache(
	async (
		locale: string,
		segmentId: number,
		pageSlug: string
	): Promise<Page | null> => {
		return getCachedPageBySegmentAndSlug(locale, segmentId, pageSlug);
	}
);
