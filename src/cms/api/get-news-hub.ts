import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { NewsHub } from "@/payload-types";

export const getNewsHub = cache(
	async (locale: TypedLocale): Promise<NewsHub | null> => {
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
);
