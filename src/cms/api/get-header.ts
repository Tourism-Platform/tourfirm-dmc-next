import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import { HEADER_CACHE_TAG } from "@/cms/cache/cache-tags";
import type { Header } from "@/payload-types";

async function fetchHeader(locale: TypedLocale): Promise<Header | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "header",
			locale,
			depth: 3,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedHeader = unstable_cache(fetchHeader, ["header-global"], {
	tags: [HEADER_CACHE_TAG],
	revalidate: 60
});

export const getHeader = cache(
	async (locale: TypedLocale): Promise<Header | null> => {
		return getCachedHeader(locale);
	}
);
