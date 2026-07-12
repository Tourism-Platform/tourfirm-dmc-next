export type TRouteTarget =
	| { type: "collection"; collection: string }
	| { type: "page"; segment: string; pathGroup?: string }
	| { type: "geo" }
	| { type: "destination" };

export type TCollectionRouteEntry = {
	key: string;
	hubPath: readonly string[];
	target: TRouteTarget;
};
