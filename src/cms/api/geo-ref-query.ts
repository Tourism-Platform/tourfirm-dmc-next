/**
 * Ancestor geo docs for breadcrumbs / hierarchy IDs only.
 * Gate 0: id/slug/title are scalars — depth 0 is enough (no blocks/seo/media).
 * country/region IDs included so parallel slug lookups can re-validate hierarchy.
 */
export const GEO_REF_DEPTH = 0 as const;

export const GEO_REF_SELECT = {
	id: true,
	slug: true,
	title: true,
	country: true,
	region: true
} as const;
