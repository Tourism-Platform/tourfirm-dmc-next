import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

import { toGeoLocale } from "./geo-locale";
import type { Country } from "@/payload-types";

export const findCountryBySlug = cache(
	async (locale: string, slug: string): Promise<Country | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "countries",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 1,
				where: {
					and: [
						{
							slug: {
								equals: slug
							}
						},
						{
							_status: {
								equals: "published"
							}
						}
					]
				}
			});

			return result.docs[0] ?? null;
		} catch {
			return null;
		}
	}
);
