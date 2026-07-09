import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import type { Theme } from "@/payload-types";

export const findThemeBySlug = cache(
	async (locale: string, slug: string): Promise<Theme | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "themes",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 1,
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

export const findThemes = cache(async (locale: string): Promise<Theme[]> => {
	try {
		const payload = await getPayload({ config });

		const result = await payload.find({
			collection: "themes",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 0,
			limit: 100,
			sort: ["sortOrder", "title"],
			where: {
				_status: { equals: "published" }
			}
		});

		return result.docs;
	} catch {
		return [];
	}
});

export const findFeaturedThemes = cache(
	async (locale: string, limit = 8): Promise<Theme[]> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: "themes",
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth: 0,
				limit,
				sort: ["sortOrder", "title"],
				where: {
					and: [
						{ featured: { equals: true } },
						{ _status: { equals: "published" } }
					]
				}
			});

			return result.docs;
		} catch {
			return [];
		}
	}
);
