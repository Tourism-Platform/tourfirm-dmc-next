import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Experience } from "@/payload-types";

export const findExperienceBySlug = cache(
	async (locale: string, slug: string): Promise<Experience | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "experiences",
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
