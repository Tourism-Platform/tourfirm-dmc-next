import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import {
	DESTINATION_PAGE_DEPTH,
	DESTINATION_PAGE_SELECT,
	GEO_FINDER_CACHE_VERSION
} from "./geo-page-query";
import { DESTINATION_GLOBAL_CACHE_TAG } from "@/cms/cache/cache-tags";
import { auditSpan } from "@/cms/perf/audit-span";
import type { Destination } from "@/payload-types";

type TLocale = "en" | "ru" | "uz";
async function fetchDestination(locale: string): Promise<Destination | null> {
	try {
		const payload = await auditSpan(
			"getPayload",
			{ caller: "fetchDestination", locale },
			() => getPayload({ config })
		);
		return (await auditSpan(
			"payload.findGlobal:destination",
			{ locale, depth: DESTINATION_PAGE_DEPTH },
			() =>
				payload.findGlobal({
					slug: "destination",
					locale: locale as TLocale,
					depth: DESTINATION_PAGE_DEPTH,
					select: DESTINATION_PAGE_SELECT,
					fallbackLocale: "en"
				})
		)) as Destination;
	} catch {
		return null;
	}
}
const getCachedDestination = unstable_cache(
	fetchDestination,
	[`destination-global-${GEO_FINDER_CACHE_VERSION}`],
	{
		tags: [DESTINATION_GLOBAL_CACHE_TAG],
		revalidate: 60
	}
);
export const getDestination = cache(
	async (locale: string): Promise<Destination | null> => {
		return auditSpan(
			"getDestination",
			{ locale, layer: "react+data" },
			() => getCachedDestination(locale)
		);
	}
);
