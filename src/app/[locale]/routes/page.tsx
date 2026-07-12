import { getTranslations, setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { CmsPagination } from "@/shared/ui/pagination";

import { Cms } from "@/widgets/cms";

import { findRoutes, getRoutesHub } from "@/cms/api";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
	searchParams: Promise<{
		page?: string;
	}>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const hub = await getRoutesHub(locale);

	return createCmsPageMetadata({
		seo: hub?.seo ?? {},
		locale,
		path: ENUM_PATH.DISCOVERY.ROUTES
	});
}

export default async function RoutesHubRoute({ params, searchParams }: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const page = query.page ? Number(query.page) : undefined;
	const t = await getTranslations("discovery_page.routes");

	const [hub, routesResult] = await Promise.all([
		getRoutesHub(locale),
		findRoutes(locale, { page })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(hub?.blocks ?? [], {
			document: (hub ?? {}) as Record<string, unknown>,
			locale,
			collections: { routes: routesResult.docs },
			query: { page: query.page }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildDiscoveryBreadcrumbs([
					{ label: "Routes", href: ENUM_PATH.DISCOVERY.ROUTES }
				])}
			/>
			<CmsPagination
				baseHref={ENUM_PATH.DISCOVERY.ROUTES}
				pagination={{
					page: routesResult.page,
					totalPages: routesResult.totalPages,
					hasNextPage: routesResult.hasNextPage,
					hasPrevPage: routesResult.hasPrevPage
				}}
				prevLabel={t("pagination_prev")}
				nextLabel={t("pagination_next")}
				ariaLabel="Routes pagination"
			/>
		</>
	);
}
