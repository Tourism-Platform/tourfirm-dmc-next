import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";

import { toGeoLocale } from "./geo-locale";
import { EXPERIENCES_NAV_CACHE_TAG } from "@/cms/hooks/revalidate-discovery-nav";
import { buildExperiencesNavTree } from "@/cms/lib/build-discovery-nav-tree";

const PUBLISHED_WHERE = {
	_status: {
		equals: "published" as const
	}
};

async function fetchExperiencesNavTree(
	locale: string
): Promise<TDiscoveryNavTree> {
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);

	const result = await payload.find({
		collection: "experiences",
		locale: geoLocale,
		fallbackLocale: "en",
		depth: 0,
		where: PUBLISHED_WHERE,
		limit: 200,
		sort: "sortOrder",
		select: {
			slug: true,
			title: true,
			subtitle: true,
			sortOrder: true
		}
	});

	return buildExperiencesNavTree(
		result.docs.map((doc) => ({
			id: doc.id,
			slug: doc.slug,
			title: doc.title,
			subtitle: doc.subtitle
		}))
	);
}

const getCachedExperiencesNavTree = unstable_cache(
	fetchExperiencesNavTree,
	["experiences-nav-tree"],
	{
		tags: [EXPERIENCES_NAV_CACHE_TAG],
		revalidate: 60
	}
);

export const getExperiencesNavTree = cache(
	async (locale: string): Promise<TDiscoveryNavTree> => {
		return getCachedExperiencesNavTree(locale);
	}
);
