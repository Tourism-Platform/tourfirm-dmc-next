import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import { FOOTER_CACHE_TAG } from "@/cms/cache/cache-tags";
import type { Footer } from "@/payload-types";

async function fetchFooter(locale: TypedLocale): Promise<Footer | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "footer",
			locale,
			depth: 3,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedFooter = unstable_cache(fetchFooter, ["footer-global"], {
	tags: [FOOTER_CACHE_TAG],
	revalidate: 60
});

export const getFooter = cache(
	async (locale: TypedLocale): Promise<Footer | null> => {
		return getCachedFooter(locale);
	}
);
