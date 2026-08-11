import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { NewsHub } from "@/payload-types";

async function fetchNewsHub(locale: TypedLocale): Promise<NewsHub | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "news-hub",
			locale,
			depth: 2,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedNewsHub = unstable_cache(fetchNewsHub, ["news-hub"], {
	revalidate: 60
});

export const getNewsHub = cache(
	async (locale: TypedLocale): Promise<NewsHub | null> => {
		return getCachedNewsHub(locale);
	}
);
