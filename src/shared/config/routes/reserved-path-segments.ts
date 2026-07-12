import { isDiscoveryRouteRoot } from "./discovery-route-roots";

/** Never usable as a page or segment slug. */
export const SYSTEM_RESERVED_SEGMENTS = ["admin", "api"] as const;

/** Static Next.js app routes outside CMS catch-all. */
export const STATIC_APP_ROUTE_SEGMENTS = ["catalog"] as const;

/**
 * @deprecated Discovery routes are owned by collection-route.registry.
 * Use isDiscoveryRouteRoot() instead.
 */
export const CMS_COLLECTION_RESERVED_SEGMENTS = [
	"routes",
	"experiences",
	"themes",
	"blog",
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

/** @deprecated Use isDiscoveryRouteRoot */
export function isCmsCollectionReservedSegment(
	value: string
): value is TCmsCollectionReservedSegment {
	return isDiscoveryRouteRoot(value);
}

/** Root CMS page slug (no segment) — cannot collide with system, static, or discovery routes. */
export function isReservedRootPageSlug(value: string): boolean {
	return (
		isSystemReservedSegment(value) ||
		isStaticAppRouteSegment(value) ||
		isDiscoveryRouteRoot(value)
	);
}

/** Segment slug — block system/static routes only; discovery roots may be segment prefixes (e.g. company). */
export function isReservedSegmentSlug(value: string): boolean {
	return (
		isSystemReservedSegment(value) ||
		isStaticAppRouteSegment(value)
	);
}

/** Geo entity slug (country etc.) — block system/static/discovery reserved only. */
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

export { isDiscoveryRouteRoot } from "./discovery-route-roots";
