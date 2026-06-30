import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { Header } from "@/payload-types";

export const getHeader = cache(
	async (locale: TypedLocale): Promise<Header | null> => {
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
);
