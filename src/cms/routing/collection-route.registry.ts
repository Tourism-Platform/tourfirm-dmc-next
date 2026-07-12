import { DISCOVERY_ROUTE_ROOTS } from "@/shared/config/routes/discovery-route-roots";

import type { TCollectionRouteEntry } from "./types/route-target.types";

export const COLLECTION_ROUTE_REGISTRY: readonly TCollectionRouteEntry[] = [
	{
		key: "blog",
		hubPath: ["blog"],
		target: { type: "collection", collection: "blog" }
	},
	{
		key: "routes",
		hubPath: ["routes"],
		target: { type: "collection", collection: "routes" }
	},
	{
		key: "experiences",
		hubPath: ["experiences"],
		target: { type: "collection", collection: "experiences" }
	},
	{
		key: "themes",
		hubPath: ["themes"],
		target: { type: "collection", collection: "themes" }
	},
	{
		key: "company-news",
		hubPath: ["company", "news"],
		target: { type: "collection", collection: "news" }
	},
	{
		key: "company-trade-fairs",
		hubPath: ["company", "trade-fairs"],
		target: { type: "collection", collection: "trade-fairs" }
	},
	{
		key: "team",
		hubPath: ["company", "team"],
		target: { type: "page", segment: "company", pathGroup: "team" }
	}
] as const;

const ROUTE_BY_KEY = new Map(
	COLLECTION_ROUTE_REGISTRY.map((entry) => [entry.key, entry])
);

export function getRouteDefinition(
	routeKey: string
): TCollectionRouteEntry | undefined {
	return ROUTE_BY_KEY.get(routeKey);
}

export function getRegisteredHubPathRoots(): ReadonlySet<string> {
	return new Set(DISCOVERY_ROUTE_ROOTS);
}

function hubPathsEqual(a: readonly string[], b: readonly string[]): boolean {
	return (
		a.length === b.length &&
		a.every((segment, index) => segment === b[index])
	);
}

export type TMatchedRegistryRoute =
	| {
			routeKey: string;
			kind: "hub";
			target: TCollectionRouteEntry["target"];
	  }
	| {
			routeKey: string;
			kind: "detail";
			slug: string;
			target: TCollectionRouteEntry["target"];
	  }
	| {
			routeKey: string;
			kind: "page";
			slug: string;
			target: Extract<TCollectionRouteEntry["target"], { type: "page" }>;
	  };

export function matchRegistryRoute(
	segments: readonly string[],
	hasHubGlobal: (routeKey: string) => boolean
): TMatchedRegistryRoute | null {
	const sorted = [...COLLECTION_ROUTE_REGISTRY].sort(
		(a, b) => b.hubPath.length - a.hubPath.length
	);

	for (const entry of sorted) {
		const { hubPath } = entry;

		if (segments.length < hubPath.length) {
			continue;
		}

		const prefix = segments.slice(0, hubPath.length);

		if (!hubPathsEqual(prefix, hubPath)) {
			continue;
		}

		if (entry.target.type === "page") {
			if (segments.length !== hubPath.length + 1) {
				continue;
			}

			return {
				routeKey: entry.key,
				kind: "page",
				slug: segments[hubPath.length]!,
				target: entry.target
			};
		}

		if (segments.length === hubPath.length) {
			if (!hasHubGlobal(entry.key)) {
				continue;
			}

			return {
				routeKey: entry.key,
				kind: "hub",
				target: entry.target
			};
		}

		if (segments.length === hubPath.length + 1) {
			return {
				routeKey: entry.key,
				kind: "detail",
				slug: segments[hubPath.length]!,
				target: entry.target
			};
		}
	}

	return null;
}
