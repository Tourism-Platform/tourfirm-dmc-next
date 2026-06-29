/** Never usable as a page or segment slug. */
export const SYSTEM_RESERVED_SEGMENTS = ["admin", "api"] as const;

/** Static Next.js app routes outside CMS catch-all. */
export const STATIC_APP_ROUTE_SEGMENTS = ["catalog"] as const;

/** Reserved for future collection detail routes. */
export const CMS_COLLECTION_RESERVED_SEGMENTS = [
	"routes",
	"experiences",
	"themes",
	"journal",
	"trade-fairs"
] as const;

/**
 * @deprecated Use specific helpers below. Kept for backward compatibility during migration.
 */
export const RESERVED_PATH_SEGMENTS = [
	...STATIC_APP_ROUTE_SEGMENTS,
	"company",
	"partners",
	"legal",
	"help",
	...SYSTEM_RESERVED_SEGMENTS,
	...CMS_COLLECTION_RESERVED_SEGMENTS
] as const;

export type TSystemReservedSegment = (typeof SYSTEM_RESERVED_SEGMENTS)[number];
export type TStaticAppRouteSegment = (typeof STATIC_APP_ROUTE_SEGMENTS)[number];
export type TCmsCollectionReservedSegment =
	(typeof CMS_COLLECTION_RESERVED_SEGMENTS)[number];
export type TReservedPathSegment = (typeof RESERVED_PATH_SEGMENTS)[number];

const SYSTEM_RESERVED_SET = new Set<string>(SYSTEM_RESERVED_SEGMENTS);
const STATIC_APP_ROUTE_SET = new Set<string>(STATIC_APP_ROUTE_SEGMENTS);
const CMS_COLLECTION_RESERVED_SET = new Set<string>(
	CMS_COLLECTION_RESERVED_SEGMENTS
);
const LEGACY_RESERVED_SET = new Set<string>(RESERVED_PATH_SEGMENTS);

export function isSystemReservedSegment(
	value: string
): value is TSystemReservedSegment {
	return SYSTEM_RESERVED_SET.has(value);
}

export function isStaticAppRouteSegment(
	value: string
): value is TStaticAppRouteSegment {
	return STATIC_APP_ROUTE_SET.has(value);
}

export function isCmsCollectionReservedSegment(
	value: string
): value is TCmsCollectionReservedSegment {
	return CMS_COLLECTION_RESERVED_SET.has(value);
}

/** Root CMS page slug (no segment) — cannot collide with system or static routes. */
export function isReservedRootPageSlug(value: string): boolean {
	return (
		isSystemReservedSegment(value) ||
		isStaticAppRouteSegment(value) ||
		isCmsCollectionReservedSegment(value)
	);
}

/** Segment slug — same restrictions as root pages plus no CMS collection prefixes. */
export function isReservedSegmentSlug(value: string): boolean {
	return isReservedRootPageSlug(value);
}

/** Geo entity slug (country etc.) — block system/static/collection reserved only. */
export function isBlockedGeoEntitySlug(value: string): boolean {
	return isReservedRootPageSlug(value);
}

/**
 * @deprecated Prefer isReservedRootPageSlug or isReservedSegmentSlug.
 */
export function isReservedPathSegment(
	value: string
): value is TReservedPathSegment {
	return LEGACY_RESERVED_SET.has(value);
}
