import config from "@payload-config";
import { unstable_cache } from "next/cache";
import type { CollectionSlug, GlobalSlug, TypedLocale, Where } from "payload";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import { DISCOVERY_LIST_DEFAULT_LIMIT } from "./discovery-query.types";
import { toGeoLocale } from "./geo-locale";
import {
	DISCOVERY_DOCUMENT_CACHE_VERSION,
	DISCOVERY_PAGE_DEPTH,
	getDiscoveryPageSelect,
	hydrateDiscoveryPageDoc
} from "./hydrate-discovery-page-doc";
import { auditSpan } from "@/cms/perf/audit-span";

export type TFindCollectionDocumentsArgs = {
	collection: string;
	locale: string;
	where?: Where;
	sort?: string | string[];
	page?: number;
	limit?: number;
	depth?: number;
};
type TCollectionListResult = {
	docs: unknown[];
	totalDocs: number;
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};
async function fetchCollectionDocuments(
	collection: string,
	locale: string,
	page: number,
	limit: number,
	depth: number,
	sortKey: string,
	whereKey: string
): Promise<TCollectionListResult> {
	try {
		const payload = await getPayload({ config });
		const sort = JSON.parse(sortKey) as string | string[];
		const where = JSON.parse(whereKey) as Where;
		const result = await payload.find({
			collection: collection as CollectionSlug,
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth,
			page,
			limit,
			sort,
			where
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
const getCachedCollectionDocuments = unstable_cache(
	fetchCollectionDocuments,
	["collection-documents"],
	{ revalidate: 60 }
);
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
		return getCachedCollectionDocuments(
			collection,
			locale,
			page,
			limit,
			depth,
			JSON.stringify(sort),
			JSON.stringify(where ?? { _status: { equals: "published" } })
		);
	}
);
async function fetchCollectionDocumentBySlug(
	collection: string,
	locale: string,
	slug: string
): Promise<Record<string, unknown> | null> {
	try {
		const payload = await auditSpan(
			"getPayload",
			{
				caller: "fetchCollectionDocumentBySlug",
				collection,
				locale,
				slug
			},
			() => getPayload({ config })
		);
		const geoLocale = toGeoLocale(locale);
		const result = await auditSpan(
			"payload.find:collectionDocumentBySlug",
			{
				collection,
				locale,
				slug,
				depth: DISCOVERY_PAGE_DEPTH,
				docs: 1
			},
			() =>
				payload.find({
					collection: collection as CollectionSlug,
					locale: geoLocale,
					fallbackLocale: "en",
					depth: DISCOVERY_PAGE_DEPTH,
					limit: 1,
					select: getDiscoveryPageSelect(collection),
					where: {
						and: [
							{ slug: { equals: slug } },
							{ _status: { equals: "published" } }
						]
					}
				})
		);
		const doc = result.docs[0];
		if (!doc) {
			return null;
		}
		return await auditSpan(
			"hydrateDiscoveryPageDoc",
			{ collection, locale, slug },
			() =>
				hydrateDiscoveryPageDoc(
					payload,
					geoLocale,
					collection,
					doc as unknown as Record<string, unknown>
				)
		);
	} catch {
		return null;
	}
}
const getCachedCollectionDocumentBySlug = unstable_cache(
	fetchCollectionDocumentBySlug,
	[`collection-document-by-slug-${DISCOVERY_DOCUMENT_CACHE_VERSION}`],
	{ revalidate: 60 }
);
export const findCollectionDocumentBySlug = cache(
	async (
		collection: string,
		locale: string,
		slug: string,
		_depth = DISCOVERY_PAGE_DEPTH
	): Promise<Record<string, unknown> | null> => {
		return auditSpan(
			"findCollectionDocumentBySlug",
			{ collection, locale, slug, layer: "react+data" },
			() => getCachedCollectionDocumentBySlug(collection, locale, slug)
		);
	}
);
async function fetchCollectionHub(
	hubGlobalSlug: string,
	locale: string
): Promise<unknown> {
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
const getCachedCollectionHub = unstable_cache(
	fetchCollectionHub,
	["collection-hub"],
	{ revalidate: 60 }
);
export const getCollectionHub = cache(
	async (hubGlobalSlug: string, locale: TypedLocale | string) => {
		return getCachedCollectionHub(hubGlobalSlug, String(locale));
	}
);
