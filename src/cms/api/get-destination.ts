import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { Destination } from "@/payload-types";

type TLocale = "en" | "ru" | "uz";

export const getDestination = cache(
	async (locale: string): Promise<Destination | null> => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: "destination",
				locale: locale as TLocale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
