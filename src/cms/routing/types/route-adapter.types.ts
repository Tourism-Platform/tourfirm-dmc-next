import type { TAppRoute } from "../app-route.types";

import type { TEntityLoadResult } from "./route-data.types";
import type { TRouteDependencies } from "./route-dependencies.types";
import type { TRouteRuntimeEntry } from "./route-runtime.types";
import type { TDiscoveryListResult } from "@/cms/api/discovery-query.types";

export type TAdapterInput = {
	route: TAppRoute;
	locale: string;
	runtime: TRouteRuntimeEntry;
	entityResult: TEntityLoadResult;
	searchParams?: { page?: string; theme?: string; country?: string };
};

export type TRouteAdapter = {
	key: string;
	resolveList?: (
		input: TAdapterInput
	) => Promise<TDiscoveryListResult<unknown>>;
	resolveDependencies?: (input: TAdapterInput) => Promise<TRouteDependencies>;
};
