import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { RoutesHubPage } from "@/page/routes";

import { findRoutes, getRoutesHub } from "@/cms/api";

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

	const [hub, routesResult] = await Promise.all([
		getRoutesHub(locale),
		findRoutes(locale, { page })
	]);

	return (
		<RoutesHubPage
			hub={hub}
			routes={routesResult.docs}
			breadcrumbItems={buildDiscoveryBreadcrumbs([
				{ label: "Routes", href: ENUM_PATH.DISCOVERY.ROUTES }
			])}
			pagination={{
				page: routesResult.page,
				totalPages: routesResult.totalPages,
				hasNextPage: routesResult.hasNextPage,
				hasPrevPage: routesResult.hasPrevPage
			}}
		/>
	);
}
