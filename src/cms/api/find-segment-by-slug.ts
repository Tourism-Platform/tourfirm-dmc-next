import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Segment } from "@/payload-types";

export const findSegmentBySlug = cache(
	async (locale: string, slug: string): Promise<Segment | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "segments",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 0,
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
