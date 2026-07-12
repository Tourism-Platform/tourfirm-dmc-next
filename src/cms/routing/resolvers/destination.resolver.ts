import type { TAppRoute } from "../app-route.types";
import type { TEntityLoadResult } from "../types/route-data.types";

import { getDestination } from "@/cms/api/get-destination";

export async function destinationResolver(
	_route: TAppRoute,
	locale: string
): Promise<TEntityLoadResult> {
	const destination = await getDestination(locale);

	if (!destination) {
		throw new Error("Destination global not found");
	}

	return {
		entity: {
			id: destination.id,
			slug: destination.slug ?? "destinations",
			title:
				destination.seo?.metaTitle ??
				destination.slug ??
				"Destinations",
			entityType: "destination"
		},
		blocks: Array.isArray(destination.blocks) ? destination.blocks : [],
		seo: (destination.seo ?? {}) as TEntityLoadResult["seo"],
		rawDocument: destination
	};
}
