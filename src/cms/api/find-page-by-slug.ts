import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

import type { Page } from "@/payload-types";

type TLocale = "en" | "ru" | "uz";

export const findPageBySlug = cache(
	async (locale: string, slug: string): Promise<Page | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "pages",
				locale: locale as TLocale,
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
