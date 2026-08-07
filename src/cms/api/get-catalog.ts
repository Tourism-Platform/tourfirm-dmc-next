import config from "@payload-config";
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

export const getCatalog = cache(
	async (locale: TypedLocale): Promise<TCatalogDoc | null> => {
		try {
			const payload = await getPayload({ config });

			return (await payload.findGlobal({
				slug: "catalog",
				locale,
				depth: 2,
				fallbackLocale: "en"
			})) as TCatalogDoc;
		} catch {
			return null;
		}
	}
);
