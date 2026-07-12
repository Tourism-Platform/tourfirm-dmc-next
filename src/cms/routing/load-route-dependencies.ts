import type { TAppRoute } from "./app-route.types";
import { getRouteAdapter } from "./route-adapter.registry";
import { getRouteRuntime } from "./route-runtime.registry";
import type { TEntityLoadResult, TRouteData } from "./types/route-data.types";
import type { TRouteDependencies } from "./types/route-dependencies.types";
import { getDestination } from "@/cms/api/get-destination";

export async function loadRouteDependencies(
	route: TAppRoute,
	entityResult: TEntityLoadResult,
	locale: string,
	searchParams?: { page?: string; theme?: string; country?: string }
): Promise<TRouteData> {
	const runtime = getRouteRuntime(route.routeKey);

	if (!runtime) {
		throw new Error(`Runtime not found for routeKey: ${route.routeKey}`);
	}

	const destination = await getDestination(locale);
	const adapter = getRouteAdapter(runtime.data.adapterKey);

	const adapterInput = {
		route,
		locale,
		runtime,
		entityResult,
		searchParams
	};

	let list: TRouteData["list"];
	let pagination: TRouteData["pagination"];
	const dependencies: TRouteDependencies = {};

	if (
		route.source === "collection" &&
		route.kind === "hub" &&
		adapter?.resolveList
	) {
		list = await adapter.resolveList(adapterInput);
		pagination = {
			page: list.page,
			totalPages: list.totalPages,
			hasNextPage: list.hasNextPage,
			hasPrevPage: list.hasPrevPage
		};
	}

	if (adapter?.resolveDependencies) {
		Object.assign(
			dependencies,
			await adapter.resolveDependencies(adapterInput)
		);
	}

	const hubEntity =
		entityResult.entity.entityType === "hub-global"
			? entityResult.entity
			: null;
	const documentEntity =
		entityResult.entity.entityType === "collection-document" ||
		entityResult.entity.entityType === "page"
			? entityResult.entity
			: route.source === "geo" || route.source === "cms"
				? entityResult.entity
				: null;

	return {
		route,
		locale,
		runtime,
		entity: documentEntity,
		hub: hubEntity,
		blocks: entityResult.blocks,
		seo: entityResult.seo,
		dependencies,
		list,
		pagination,
		navigation: { rootSlug: destination?.slug ?? "destinations" }
	};
}
