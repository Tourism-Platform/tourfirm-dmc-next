import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildRouteDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { RouteDetailPage } from "@/page/routes";

import { findRouteBySlug, getDestination } from "@/cms/api";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const route = await findRouteBySlug(locale, slug);

	if (!route) {
		return {};
	}

	return createCmsPageMetadata({
		seo: route.seo ?? {},
		locale,
		path: `/routes/${slug}`
	});
}

export default async function RouteDetailRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const [route, destination] = await Promise.all([
		findRouteBySlug(locale, slug),
		getDestination(locale)
	]);

	if (!route) {
		notFound();
	}

	return (
		<RouteDetailPage
			route={route}
			navigationRootSlug={destination?.slug ?? "destinations"}
			breadcrumbItems={buildRouteDetailBreadcrumbs(
				route.title,
				route.slug
			)}
		/>
	);
}
