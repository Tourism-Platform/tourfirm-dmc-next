import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Page } from "@/payload-types";

export const findPageBySegmentAndSlug = cache(
	async (
		locale: string,
		segmentId: number,
		pageSlug: string
	): Promise<Page | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "pages",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 2,
				limit: 1,
				where: {
					and: [
						{
							slug: {
								equals: pageSlug
							}
						},
						{
							segment: {
								equals: segmentId
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
