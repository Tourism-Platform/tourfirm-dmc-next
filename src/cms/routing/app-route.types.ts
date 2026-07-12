import type { TGeoRoute } from "./geo-route.types";
import type { TRouteTarget } from "./types/route-target.types";
import type { Destination, Page, Segment } from "@/payload-types";

export type TAppRouteBase = {
	routeKey: string;
	target: TRouteTarget;
};

export type TAppRoute =
	| (TAppRouteBase & { source: "geo" } & TGeoRoute)
	| (TAppRouteBase & {
			source: "cms";
			kind: "destination";
			document: Destination;
	  })
	| (TAppRouteBase & {
			source: "cms";
			kind: "page";
			document: Page;
			slug: string;
			segment?: Segment;
	  })
	| (TAppRouteBase & {
			source: "cms";
			kind: "segment-page";
			document: Page;
			segment: Segment;
	  })
	| (TAppRouteBase & { source: "collection"; kind: "hub" })
	| (TAppRouteBase & { source: "collection"; kind: "detail"; slug: string });
