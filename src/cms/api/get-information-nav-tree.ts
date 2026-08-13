import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";

import type {
	TInformationAreaConfig,
	TInformationNavCollection,
	TInformationNavTree
} from "@/shared/types/information-nav.types";

import { toGeoLocale } from "./geo-locale";
import { INFORMATION_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";
import {
	buildInformationNavArea,
	buildInformationNavTree
} from "@/cms/lib/build-information-nav-tree";
import {
	type TNavSurface,
	buildNavVisibilityWhere
} from "@/cms/lib/nav-visibility-where";

const INFORMATION_NAV_LIMIT = 20;
const VALID_COLLECTIONS = new Set<TInformationNavCollection>([
	"news",
	"blog",
	"trade-fairs"
]);
function isInformationCollection(
	value: string
): value is TInformationNavCollection {
	return VALID_COLLECTIONS.has(value as TInformationNavCollection);
}
async function fetchInformationNavTree(
	locale: string,
	areasJson: string,
	surface: TNavSurface
): Promise<TInformationNavTree> {
	const areas = JSON.parse(areasJson) as TInformationAreaConfig[];
	if (!areas.length) {
		return buildInformationNavTree([]);
	}
	const payload = await getPayload({ config });
	const geoLocale = toGeoLocale(locale);
	const where = buildNavVisibilityWhere(surface);
	const resolvedAreas = await Promise.all(
		areas.map(async (area, index) => {
			if (!isInformationCollection(area.collection)) {
				return null;
			}
			const result = await payload.find({
				collection: area.collection,
				locale: geoLocale,
				fallbackLocale: "en",
				depth: 0,
				where,
				limit: INFORMATION_NAV_LIMIT,
				sort: "sortOrder",
				select: {
					slug: true,
					title: true,
					sortOrder: true
				}
			});
			return buildInformationNavArea({
				key: area.id ?? `${area.collection}-${index}`,
				collection: area.collection,
				label: area.label,
				docs: result.docs.map((doc) => ({
					id: doc.id,
					slug: doc.slug,
					title: doc.title
				}))
			});
		})
	);
	return buildInformationNavTree(
		resolvedAreas.filter(
			(area): area is NonNullable<typeof area> => area != null
		)
	);
}
const getCachedInformationNavTree = unstable_cache(
	fetchInformationNavTree,
	["information-nav-tree"],
	{
		tags: [INFORMATION_NAV_CACHE_TAG],
		revalidate: 60
	}
);
export const getInformationNavTree = cache(
	async (
		locale: string,
		areas: TInformationAreaConfig[] | null | undefined,
		surface: TNavSurface
	): Promise<TInformationNavTree> => {
		const normalized =
			areas
				?.filter((area) => isInformationCollection(area.collection))
				.map((area) => ({
					id: area.id ?? null,
					collection: area.collection,
					label: area.label ?? null
				})) ?? [];
		return getCachedInformationNavTree(
			locale,
			JSON.stringify(normalized),
			surface
		);
	}
);
