import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { isPagePathGroup } from "@/shared/config/routes/page-path-groups";

import { toGeoLocale } from "./geo-locale";
import type { Page } from "@/payload-types";

async function fetchPageBySegmentGroupAndSlug(
	locale: string,
	segmentId: number,
	pathGroup: string,
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
					{ pathGroup: { equals: pathGroup } },
					{ _status: { equals: "published" } }
				]
			}
		});
		return result.docs[0] ?? null;
	} catch {
		return null;
	}
}
const getCachedPageBySegmentGroupAndSlug = unstable_cache(
	fetchPageBySegmentGroupAndSlug,
	["page-by-segment-group-slug"],
	{ revalidate: 60 }
);
export const findPageBySegmentGroupAndSlug = cache(
	async (
		locale: string,
		segmentId: number,
		pathGroup: string,
		pageSlug: string
	): Promise<Page | null> => {
		if (!isPagePathGroup(pathGroup)) {
			return null;
		}
		return getCachedPageBySegmentGroupAndSlug(
			locale,
			segmentId,
			pathGroup,
			pageSlug
		);
	}
);
