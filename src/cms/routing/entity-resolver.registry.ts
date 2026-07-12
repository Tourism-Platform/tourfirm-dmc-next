import type { TAppRoute } from "./app-route.types";
import { collectionResolver } from "./resolvers/collection.resolver";
import { destinationResolver } from "./resolvers/destination.resolver";
import { geoResolver } from "./resolvers/geo.resolver";
import { pageResolver } from "./resolvers/page.resolver";
import type { TEntityLoadResult } from "./types/route-data.types";

export const ENTITY_RESOLVER_REGISTRY = {
	collection: collectionResolver,
	page: pageResolver,
	geo: geoResolver,
	destination: destinationResolver
} as const;

export type TEntityResolverTarget = keyof typeof ENTITY_RESOLVER_REGISTRY;

export async function resolveEntityByTarget(
	route: TAppRoute,
	locale: string
): Promise<TEntityLoadResult> {
	const targetType = route.target.type as TEntityResolverTarget;
	const resolver = ENTITY_RESOLVER_REGISTRY[targetType];

	if (!resolver) {
		throw new Error(`No entity resolver for target: ${route.target.type}`);
	}

	return resolver(route, locale);
}
