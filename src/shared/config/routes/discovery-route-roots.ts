/** First URL segments owned by discovery route registry. */
export const DISCOVERY_ROUTE_ROOTS = [
	"blog",
	"routes",
	"experiences",
	"themes",
	"company"
] as const;

const DISCOVERY_ROUTE_ROOTS_SET = new Set<string>(DISCOVERY_ROUTE_ROOTS);

export function isDiscoveryRouteRoot(value: string): boolean {
	return DISCOVERY_ROUTE_ROOTS_SET.has(value);
}
