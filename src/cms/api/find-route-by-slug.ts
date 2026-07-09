import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Route } from "@/payload-types";

export const findRouteBySlug = cache(
	async (locale: string, slug: string): Promise<Route | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "routes",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 3,
				limit: 1,
				where: {
					and: [
						{ slug: { equals: slug } },
						{ _status: { equals: "published" } }
					]
				}
			});

			return result.docs[0] ?? null;
		} catch {
			return null;
		}
	}
);
