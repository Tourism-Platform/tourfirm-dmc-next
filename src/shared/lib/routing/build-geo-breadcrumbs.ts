import { buildNavigationGeoPath } from "./build-navigation-geo-path";
import type { TGeoRoute } from "@/cms/routing/geo-route.types";
import { resolveGeoLabels } from "@/cms/routing/resolve-geo-labels";

export type TBreadcrumbItem = {
	label: string;
	href: string;
};

function getNavigationRootSlug(route: TGeoRoute): string {
	return route.path.split("/").filter(Boolean)[0] ?? "destinations";
}

export function buildGeoBreadcrumbs(
	route: TGeoRoute,
	destinationsLabel = "Destinations"
): TBreadcrumbItem[] {
	const navigationRootSlug = getNavigationRootSlug(route);
	const resolved = resolveGeoLabels(route);

	const items: TBreadcrumbItem[] = [
		{
			label: destinationsLabel,
			href: buildNavigationGeoPath(navigationRootSlug, [])
		}
	];

	for (let index = 0; index < resolved.length; index++) {
		const segmentSlugs = route.segments
			.slice(0, index + 1)
			.map((segment) => segment.slug);

		items.push({
			label: resolved[index]!.label,
			href: buildNavigationGeoPath(navigationRootSlug, segmentSlugs)
		});
	}

	return items;
}
