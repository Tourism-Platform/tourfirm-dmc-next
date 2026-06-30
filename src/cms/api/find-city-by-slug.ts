import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { City } from "@/payload-types";

export const findCityBySlug = cache(
	async (
		locale: string,
		countryId: number,
		regionId: number,
		citySlug: string
	): Promise<City | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "cities",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 1,
				where: {
					and: [
						{
							slug: {
								equals: citySlug
							}
						},
						{
							country: {
								equals: countryId
							}
						},
						{
							region: {
								equals: regionId
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
