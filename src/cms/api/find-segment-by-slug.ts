import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import { auditSpan } from "@/cms/perf/audit-span";
import type { Segment } from "@/payload-types";

async function fetchSegmentBySlug(
	locale: string,
	slug: string
): Promise<Segment | null> {
	try {
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchSegmentBySlug", locale, slug },
			() => getPayload({ config })
		);
		const result = await auditSpan(
			"payload.find:segmentBySlug",
			{ locale, slug, depth: 0 },
			() =>
				payload.find({
					collection: "segments",
					locale: toGeoLocale(locale),
					fallbackLocale: "en",
					depth: 0,
					limit: 1,
					where: {
						and: [
							{ slug: { equals: slug } },
							{ _status: { equals: "published" } }
						]
					}
				})
		);
		return result.docs[0] ?? null;
	} catch {
		return null;
	}
}
const getCachedSegmentBySlug = unstable_cache(
	fetchSegmentBySlug,
	["segment-by-slug"],
	{ revalidate: 60 }
);
export const findSegmentBySlug = cache(
	async (locale: string, slug: string): Promise<Segment | null> => {
		return auditSpan(
			"findSegmentBySlug",
			{ locale, slug, layer: "react+data" },
			() => getCachedSegmentBySlug(locale, slug)
		);
	}
);
