import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { BlogHub } from "@/payload-types";

async function fetchBlogHub(locale: TypedLocale): Promise<BlogHub | null> {
	try {
		const payload = await getPayload({ config });

		return await payload.findGlobal({
			slug: "blog-hub",
			locale,
			depth: 2,
			fallbackLocale: "en"
		});
	} catch {
		return null;
	}
}

const getCachedBlogHub = unstable_cache(fetchBlogHub, ["blog-hub"], {
	revalidate: 60
});

export const getBlogHub = cache(
	async (locale: TypedLocale): Promise<BlogHub | null> => {
		return getCachedBlogHub(locale);
	}
);
