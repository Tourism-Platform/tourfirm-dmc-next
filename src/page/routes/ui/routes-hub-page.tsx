import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";

import { RoutesHub } from "@/widgets/routes";

import { mapCmsBlocks } from "@/cms/lib";
import { mapRouteToCard } from "@/cms/lib/map-discovery-cards";
import type { Route, RoutesHub as TRoutesHubGlobal } from "@/payload-types";

type TProps = {
	hub: TRoutesHubGlobal | null;
	routes: Route[];
	breadcrumbItems: TBreadcrumbItem[];
	pagination: {
		page: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
};

export async function RoutesHubPage({
	hub,
	routes,
	breadcrumbItems,
	pagination
}: TProps) {
	const t = await getTranslations("discovery_page.routes");

	return (
		<RoutesHub
			title={hub?.title ?? "Travel routes"}
			subtitle={hub?.subtitle ?? undefined}
			eyebrow={t("eyebrow")}
			catalogTitle={t("catalog_title")}
			catalogDescription={t("catalog_description")}
			emptyLabel={t("empty")}
			paginationPrevLabel={t("pagination_prev")}
			paginationNextLabel={t("pagination_next")}
			introSections={mapCmsBlocks(hub?.blocks ?? [])}
			cards={routes.map(mapRouteToCard)}
			breadcrumbItems={breadcrumbItems}
			baseHref={ENUM_PATH.DISCOVERY.ROUTES}
			pagination={pagination}
		/>
	);
}
