import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";

import { toGeoLocale } from "./geo-locale";
import { EXPERIENCES_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";
import { buildExperiencesNavTree } from "@/cms/lib/build-discovery-nav-tree";
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
async function fetchPublishedExperiencesNav(
	locale: string
): Promise<TNavDoc[]> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);
	const result = await payload.find({
		collection: "experiences",
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
const getCachedPublishedExperiencesNav = unstable_cache(
	fetchPublishedExperiencesNav,
	["experiences-nav-published"],
	{
		tags: [EXPERIENCES_NAV_CACHE_TAG],
		revalidate: 60
	}
);
const publishedExperiencesInflight = new Map<string, Promise<TNavDoc[]>>();
function getPublishedExperiencesNav(locale: string): Promise<TNavDoc[]> {
	const existing = publishedExperiencesInflight.get(locale);
	if (existing) {
		return existing;
	}
	const pending = getCachedPublishedExperiencesNav(locale).finally(() => {
		publishedExperiencesInflight.delete(locale);
	});
	publishedExperiencesInflight.set(locale, pending);
	return pending;
}
export const getExperiencesNavTree = cache(
	async (
		locale: string,
		surface: TNavSurface = "header"
	): Promise<TDiscoveryNavTree> => {
		const docs = await getPublishedExperiencesNav(locale);
		return buildExperiencesNavTree(
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
