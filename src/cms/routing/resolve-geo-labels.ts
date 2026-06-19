import type { TGeoRoute } from "./geo-route.types";

export type TResolvedGeoSegment = {
	slug: string;
	type: TGeoRoute["segments"][number]["type"];
	label: string;
};

function getEntityTitleAtIndex(route: TGeoRoute, index: number): string {
	switch (route.kind) {
		case "country":
			return index === 0 ? route.document.title : "";
		case "region":
			if (index === 0) {
				return route.country.title;
			}

			if (index === 1) {
				return route.document.title;
			}

			return "";
		case "city":
			if (index === 0) {
				return route.country.title;
			}

			if (index === 1) {
				return route.region.title;
			}

			if (index === 2) {
				return route.document.title;
			}

			return "";
		case "attraction":
			if (index === 0) {
				return route.country.title;
			}

			if (index === 1) {
				return route.region.title;
			}

			if (index === 2) {
				return route.city.title;
			}

			if (index === 3) {
				return route.document.title;
			}

			return "";
	}
}

/** Sync. Labels from documents already loaded on TGeoRoute — no CMS fetch. */
export function resolveGeoLabels(route: TGeoRoute): TResolvedGeoSegment[] {
	return route.segments.map((segment, index) => ({
		slug: segment.slug,
		type: segment.type,
		label: getEntityTitleAtIndex(route, index)
	}));
}
