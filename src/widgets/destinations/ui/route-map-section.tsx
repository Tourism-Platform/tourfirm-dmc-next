import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

import { ROUTE_MAP_STOPS } from "../model";

import { RouteMapView } from "./route-map-view";

export async function RouteMapSection() {
	const t = await getTranslations("destinations_page");

	const stops = ROUTE_MAP_STOPS.map((stop) => ({
		...stop,
		name: t(stop.i18nKey)
	}));

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("route_map.eyebrow")}
				title={t("route_map.title")}
				description={t("route_map.description")}
			/>
			<RouteMapView stops={stops} />
		</section>
	);
}
