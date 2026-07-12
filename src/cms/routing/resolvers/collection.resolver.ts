import type { TAppRoute } from "../app-route.types";
import { getRouteRuntime } from "../route-runtime.registry";
import type { TEntityLoadResult } from "../types/route-data.types";

import {
	findCollectionDocumentBySlug,
	getCollectionHub
} from "@/cms/api/find-collection-documents";

function toEntity(
	doc: Record<string, unknown>,
	entityType: TEntityLoadResult["entity"]["entityType"]
): TEntityLoadResult["entity"] {
	return {
		id: (doc.id as number | string) ?? "",
		slug: String(doc.slug ?? ""),
		title: String(doc.title ?? doc.name ?? ""),
		entityType
	};
}

function extractSeo(doc: Record<string, unknown>): TEntityLoadResult["seo"] {
	const seo = doc.seo;

	if (!seo || typeof seo !== "object") {
		return {};
	}

	return seo as TEntityLoadResult["seo"];
}

function extractBlocks(
	doc: Record<string, unknown>
): TEntityLoadResult["blocks"] {
	const blocks = doc.blocks;

	return Array.isArray(blocks) ? blocks : [];
}

export async function collectionResolver(
	route: TAppRoute,
	locale: string
): Promise<TEntityLoadResult> {
	const runtime = getRouteRuntime(route.routeKey);

	if (!runtime?.data.collection) {
		throw new Error(`Missing collection for routeKey: ${route.routeKey}`);
	}

	if (route.source === "collection" && route.kind === "hub") {
		const hubGlobal = runtime.data.hubGlobal;

		if (!hubGlobal) {
			throw new Error(
				`Missing hubGlobal for hub route: ${route.routeKey}`
			);
		}

		const hubDoc = (await getCollectionHub(hubGlobal, locale)) as Record<
			string,
			unknown
		> | null;

		if (!hubDoc) {
			throw new Error(`Hub global not found: ${hubGlobal}`);
		}

		return {
			entity: toEntity(hubDoc, "hub-global"),
			blocks: extractBlocks(hubDoc),
			seo: extractSeo(hubDoc),
			rawDocument: hubDoc
		};
	}

	if (route.source === "collection" && route.kind === "detail") {
		const doc = await findCollectionDocumentBySlug(
			runtime.data.collection,
			locale,
			route.slug
		);

		if (!doc) {
			throw new Error(`Document not found: ${route.slug}`);
		}

		return {
			entity: toEntity(doc, "collection-document"),
			blocks: extractBlocks(doc),
			seo: extractSeo(doc),
			rawDocument: doc
		};
	}

	throw new Error(`Invalid collection route kind for ${route.routeKey}`);
}
