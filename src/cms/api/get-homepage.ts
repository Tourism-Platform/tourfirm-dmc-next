import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { Homepage } from "@/payload-types";

export const getHomepage = cache(
	async (locale: TypedLocale): Promise<Homepage | null> => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: "homepage",
				locale: locale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
