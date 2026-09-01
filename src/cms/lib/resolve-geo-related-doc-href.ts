import "server-only";

import {
	buildAttractionHref,
	buildCityHref,
	buildCountryHref,
	buildRegionHref
} from "@/shared/lib/routing/build-geo-entity-href";

import type { Attraction, City, Country, Region } from "@/payload-types";

const DEFAULT_DESTINATION_ROOT = "destinations";

type TRelatedDoc = {
	relationTo?: string;
	value?: unknown;
};

function asRelatedDoc(relatedDoc: unknown): TRelatedDoc | null {
	if (!relatedDoc || typeof relatedDoc !== "object") {
		return null;
	}

	if (!("relationTo" in relatedDoc) || !("value" in relatedDoc)) {
		return null;
	}

	return relatedDoc as TRelatedDoc;
}

function isBareDestinationRoot(href: string, rootSlug: string): boolean {
	return href === `/${rootSlug}`;
}

export function resolveGeoHrefFromRelatedDoc(
	relatedDoc: unknown,
	navigationRootSlug = DEFAULT_DESTINATION_ROOT
): string | undefined {
	const related = asRelatedDoc(relatedDoc);
	const value = related?.value;

	if (!related?.relationTo || value == null || typeof value !== "object") {
		return undefined;
	}

	const rootSlug = navigationRootSlug || DEFAULT_DESTINATION_ROOT;
	let href: string;

	switch (related.relationTo) {
		case "countries":
			href = buildCountryHref(rootSlug, value as Country);
			break;
		case "regions":
			href = buildRegionHref(rootSlug, value as Region);
			break;
		case "cities":
			href = buildCityHref(rootSlug, value as City);
			break;
		case "attractions":
			href = buildAttractionHref(rootSlug, value as Attraction);
			break;
		default:
			return undefined;
	}

	if (isBareDestinationRoot(href, rootSlug)) {
		return undefined;
	}

	return href;
}
