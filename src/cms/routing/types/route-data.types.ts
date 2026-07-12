import type { TAppRoute } from "../app-route.types";

import type { TRouteDependencies } from "./route-dependencies.types";
import type { TRouteRuntimeEntry } from "./route-runtime.types";
import type { TDiscoveryListResult } from "@/cms/api/discovery-query.types";
import type { TCmsPageBlock } from "@/cms/lib/resolve-block-data.types";
import type { Homepage } from "@/payload-types";

export type TRouteEntityType =
	| "collection-document"
	| "hub-global"
	| "page"
	| "geo"
	| "destination";

export type TRouteEntity = {
	id: number | string;
	slug: string;
	title: string;
	entityType: TRouteEntityType;
};

export type TSeoFields = NonNullable<Homepage["seo"]>;

export type TPaginationState = {
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export type TRouteData = {
	route: TAppRoute;
	locale: string;
	runtime: TRouteRuntimeEntry;
	entity: TRouteEntity | null;
	hub: TRouteEntity | null;
	blocks: TCmsPageBlock[];
	seo: TSeoFields;
	dependencies: TRouteDependencies;
	list?: TDiscoveryListResult<unknown>;
	pagination?: TPaginationState;
	navigation: { rootSlug: string };
};

export type TEntityLoadResult = {
	entity: TRouteEntity;
	blocks: TCmsPageBlock[];
	seo: TSeoFields;
	hub?: TRouteEntity;
	rawDocument: unknown;
};
