import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildRouteDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";
import { RouteStopsTimeline } from "@/widgets/discovery";

import { findRouteBySlug, getDestination } from "@/cms/api";
import { extractMapPoints, mapCmsBlocks, resolveBlockData } from "@/cms/lib";
import { mapRoutePointsToTimeline } from "@/cms/lib/map-route-points";

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

	const sections = mapCmsBlocks(
		resolveBlockData(route.blocks, {
			document: route as unknown as Record<string, unknown>,
			locale,
			navigation: { rootSlug: destination?.slug ?? "destinations" }
		})
	);

	const timeline = mapRoutePointsToTimeline(extractMapPoints(route));

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildRouteDetailBreadcrumbs(
					route.title,
					route.slug
				)}
			/>
			{timeline.length ? (
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
					<RouteStopsTimeline items={timeline} />
				</div>
			) : null}
		</>
	);
}
