import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

import { toGeoLocale } from "./geo-locale";
import type { Region } from "@/payload-types";

export const findRegionBySlug = cache(
	async (
		locale: string,
		countryId: number,
		regionSlug: string
	): Promise<Region | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "regions",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 1,
				where: {
					and: [
						{
							slug: {
								equals: regionSlug
							}
						},
						{
							country: {
								equals: countryId
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
