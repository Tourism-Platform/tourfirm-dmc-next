/**
 * Shared Payload Local API options for CMS page-shaped geo/page/destination docs.
 * Leaf finds use depth 0 + hydrateGeoPageDoc (lean media + routeMap stop coords).
 * Depth 1 is avoided: Payload populates full related geo docs including their blocks.
 */
export const GEO_PAGE_DEPTH = 0 as const;

export const GEO_PAGE_SELECT = {
	id: true,
	slug: true,
	title: true,
	blocks: true,
	seo: true
} as const;

export const DESTINATION_PAGE_DEPTH = 1 as const;

export const DESTINATION_PAGE_SELECT = {
	slug: true,
	blocks: true,
	seo: true
} as const;

/** Cache key bump after depth0+hydrate leaf shape (v4→v5). */
export const GEO_FINDER_CACHE_VERSION = "v5" as const;
