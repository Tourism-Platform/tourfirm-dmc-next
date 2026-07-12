import config from "@payload-config";
import type { CollectionSlug, GlobalSlug, TypedLocale, Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { DISCOVERY_LIST_DEFAULT_LIMIT } from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";

export type TFindCollectionDocumentsArgs = {
	collection: string;
	locale: string;
	where?: Where;
	sort?: string | string[];
	page?: number;
	limit?: number;
	depth?: number;
};

export const findCollectionDocuments = cache(
	async ({
		collection,
		locale,
		where,
		sort = ["sortOrder", "title"],
		page = 1,
		limit = DISCOVERY_LIST_DEFAULT_LIMIT,
		depth = 1
	}: TFindCollectionDocumentsArgs) => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: collection as CollectionSlug,
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth,
				page,
				limit,
				sort,
				where: where ?? { _status: { equals: "published" } }
			});

			return {
				docs: result.docs,
				totalDocs: result.totalDocs,
				page: result.page ?? 1,
				totalPages: result.totalPages,
				hasNextPage: result.hasNextPage,
				hasPrevPage: result.hasPrevPage
			};
		} catch {
			return {
				docs: [],
				totalDocs: 0,
				page: 1,
				totalPages: 0,
				hasNextPage: false,
				hasPrevPage: false
			};
		}
	}
);

export const findCollectionDocumentBySlug = cache(
	async (
		collection: string,
		locale: string,
		slug: string,
		depth = 3
	): Promise<Record<string, unknown> | null> => {
		try {
			const payload = await getPayload({ config });

			const result = await payload.find({
				collection: collection as CollectionSlug,
				locale: toGeoLocale(locale),
				fallbackLocale: "en",
				depth,
				limit: 1,
				where: {
					and: [
						{ slug: { equals: slug } },
						{ _status: { equals: "published" } }
					]
				}
			});

			const doc = result.docs[0];

			return doc ? (doc as unknown as Record<string, unknown>) : null;
		} catch {
			return null;
		}
	}
);

export const getCollectionHub = cache(
	async (hubGlobalSlug: string, locale: TypedLocale | string) => {
		try {
			const payload = await getPayload({ config });

			return await payload.findGlobal({
				slug: hubGlobalSlug as GlobalSlug,
				locale: locale as TypedLocale,
				depth: 2,
				fallbackLocale: "en"
			});
		} catch {
			return null;
		}
	}
);
