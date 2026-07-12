import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { BlogHub } from "@/payload-types";

export const getBlogHub = cache(
	async (locale: TypedLocale): Promise<BlogHub | null> => {
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
);
