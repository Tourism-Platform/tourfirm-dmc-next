import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { buildGeoBreadcrumbs } from "@/shared/lib/routing/build-geo-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";
import { Destinations } from "@/widgets/destinations";

import { CmsPage } from "@/page/cms";

import { mapCmsBlocks } from "@/cms/lib";
import { type TGeoRoute, resolveAppRoute } from "@/cms/routing";
import { getCmsRoutePath } from "@/cms/routing/get-cms-route-path";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: string; geo: string[] }>;
};

function isGeoPageKind(
	kind: TGeoRoute["kind"]
): kind is "country" | "region" | "city" | "attraction" {
	return (
		kind === "country" ||
		kind === "region" ||
		kind === "city" ||
		kind === "attraction"
	);
}

export async function generateMetadata({ params }: TProps) {
	const { locale, geo } = await params;

	const route = await resolveAppRoute(locale, geo ?? []);

	if (!route) {
		return {};
	}

	if (route.source === "geo" && isGeoPageKind(route.kind)) {
		return createCmsPageMetadata({
			seo: route.document.seo ?? {},

			locale,

			path: route.path
		});
	}

	if (route.source !== "cms") {
		return {};
	}

	return createCmsPageMetadata({
		seo: route.document.seo ?? {},

		locale,

		path: getCmsRoutePath(route, geo?.[0])
	});
}

export default async function GeoCatchAllRoute({ params }: TProps) {
	const { locale, geo } = await params;

	setRequestLocale(locale);

	const segments = geo ?? [];

	const route = await resolveAppRoute(locale, segments);

	if (!route) {
		notFound();
	}

	if (route.source === "geo") {
		const sections = mapCmsBlocks(route.document.blocks);
		const t = await getTranslations("header.public.nav.destinations");
		const breadcrumbItems = buildGeoBreadcrumbs(route, t("label"));
		return <Cms sections={sections} breadcrumbItems={breadcrumbItems} />;
	}

	const sections = mapCmsBlocks(route.document.blocks);

	if (route.kind === "destination") {
		return <Destinations sections={sections} />;
	}

	return <CmsPage sections={sections} />;
}
