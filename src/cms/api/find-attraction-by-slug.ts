import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Attraction } from "@/payload-types";

export const findAttractionBySlug = cache(
	async (
		locale: string,
		cityId: number,
		attractionSlug: string
	): Promise<Attraction | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "attractions",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 1,
				where: {
					and: [
						{
							slug: {
								equals: attractionSlug
							}
						},
						{
							city: {
								equals: cityId
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
