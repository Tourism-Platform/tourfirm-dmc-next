import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

type TCatalogDoc = {
	seo?: {
		metaTitle?: string | null;
		metaDescription?: string | null;
		[key: string]: unknown;
	} | null;
	blocks?: unknown[] | null;
};
async function fetchTours(locale: TypedLocale): Promise<TCatalogDoc | null> {
	try {
		const payload = await getPayload({ config });
		return (await payload.findGlobal({
			slug: "tours",
			locale,
			depth: 2,
			fallbackLocale: "en"
		})) as TCatalogDoc;
	} catch {
		return null;
	}
}
const getCachedTours = unstable_cache(fetchTours, ["tours-global"], {
	revalidate: 60
});
export const getTours = cache(
	async (locale: TypedLocale): Promise<TCatalogDoc | null> => {
		return getCachedTours(locale);
	}
);
