import type { TAppRoute } from "./app-route.types";
import { loadRouteDependencies } from "./load-route-dependencies";
import { loadRouteEntity } from "./load-route-entity";
import type { TRouteData } from "./types/route-data.types";

export async function loadRouteData(
	route: TAppRoute,
	locale: string,
	searchParams?: { page?: string; theme?: string; country?: string }
): Promise<{
	data: TRouteData;
	entityResult: Awaited<ReturnType<typeof loadRouteEntity>>;
}> {
	const entityResult = await loadRouteEntity(route, locale);
	const data = await loadRouteDependencies(
		route,
		entityResult,
		locale,
		searchParams
	);

	return { data, entityResult };
}
