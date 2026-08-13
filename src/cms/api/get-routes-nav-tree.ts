import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";

import { toGeoLocale } from "./geo-locale";
import { ROUTES_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";
import { buildRoutesNavTree } from "@/cms/lib/build-discovery-nav-tree";
import {
	type TNavSurface,
	isVisibleOnNavSurface
} from "@/cms/lib/nav-visibility-where";

type TNavDoc = {
	id: number;
	slug: string;
	title: string;
	subtitle?: string | null;
	status?: {
		showInHeader?: boolean | null;
		showInFooter?: boolean | null;
	};
};
async function fetchPublishedRoutesNav(locale: string): Promise<TNavDoc[]> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);
	const result = await payload.find({
		collection: "routes",
		locale: geoLocale,
		fallbackLocale: "en",
		depth: 0,
		where: { _status: { equals: "published" } },
		limit: 200,
		sort: "sortOrder",
		select: {
			slug: true,
			title: true,
			subtitle: true,
			sortOrder: true,
			status: {
				showInHeader: true,
				showInFooter: true
			}
		}
	});
	return result.docs as TNavDoc[];
}
const getCachedPublishedRoutesNav = unstable_cache(
	fetchPublishedRoutesNav,
	["routes-nav-published"],
	{
		tags: [ROUTES_NAV_CACHE_TAG],
		revalidate: 60
	}
);
const publishedRoutesInflight = new Map<string, Promise<TNavDoc[]>>();
function getPublishedRoutesNav(locale: string): Promise<TNavDoc[]> {
	const existing = publishedRoutesInflight.get(locale);
	if (existing) {
		return existing;
	}
	const pending = getCachedPublishedRoutesNav(locale).finally(() => {
		publishedRoutesInflight.delete(locale);
	});
	publishedRoutesInflight.set(locale, pending);
	return pending;
}
export const getRoutesNavTree = cache(
	async (
		locale: string,
		surface: TNavSurface = "header"
	): Promise<TDiscoveryNavTree> => {
		const docs = await getPublishedRoutesNav(locale);
		return buildRoutesNavTree(
			docs
				.filter((doc) => isVisibleOnNavSurface(doc.status, surface))
				.map((doc) => ({
					id: doc.id,
					slug: doc.slug,
					title: doc.title,
					subtitle: doc.subtitle
				}))
		);
	}
);
