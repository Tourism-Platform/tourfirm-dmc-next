import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { RoutesHub } from "@/payload-types";

export const getRoutesHub = cache(
	async (locale: TypedLocale): Promise<RoutesHub | null> => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: "routes-hub",
				locale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
