import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { Footer } from "@/payload-types";

export const getFooter = cache(
	async (locale: TypedLocale): Promise<Footer | null> => {
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
);
