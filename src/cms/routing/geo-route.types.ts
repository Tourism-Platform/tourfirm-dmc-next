import type { Attraction, City, Country, Region } from "@/payload-types";

export type TGeoEntityType = "country" | "region" | "city" | "attraction";

export type TGeoSegment = {
	slug: string;
	type: TGeoEntityType;
};

type TGeoRouteBase = {
	path: string;
	segments: readonly TGeoSegment[];
};

export type TGeoRoute =
	| (TGeoRouteBase & {
			kind: "country";
			document: Country;
	  })
	| (TGeoRouteBase & {
			kind: "region";
			document: Region;
			country: Country;
	  })
	| (TGeoRouteBase & {
			kind: "city";
			document: City;
			country: Country;
			region: Region;
	  })
	| (TGeoRouteBase & {
			kind: "attraction";
			document: Attraction;
			country: Country;
			region: Region;
			city: City;
	  });
