import type { Attraction, City, Country, Region } from "@/payload-types";

export type TGeoRoute =
	| {
			kind: "country";
			document: Country;
			path: string;
			segments: readonly [string];
	  }
	| {
			kind: "region";
			document: Region;
			country: Country;
			path: string;
			segments: readonly [string, string];
	  }
	| {
			kind: "city";
			document: City;
			country: Country;
			region: Region;
			path: string;
			segments: readonly [string, string, string];
	  }
	| {
			kind: "attraction";
			document: Attraction;
			country: Country;
			region: Region;
			city: City;
			path: string;
			segments: readonly [string, string, string, string];
	  };
