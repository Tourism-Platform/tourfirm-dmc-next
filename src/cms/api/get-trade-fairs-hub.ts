import config from "@payload-config";
import { getPayload } from "payload";
import type { TypedLocale } from "payload";
import { cache } from "react";
import "server-only";

import type { TradeFairsHub } from "@/payload-types";

export const getTradeFairsHub = cache(
	async (locale: TypedLocale): Promise<TradeFairsHub | null> => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: "trade-fairs-hub",
				locale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
