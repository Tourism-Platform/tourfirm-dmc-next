import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
	buildCmsPath,
	buildGeoBreadcrumbs,
	createCmsPageMetadata
} from "@/shared/lib";

import { AttractionPage } from "@/page/attraction";
import { CityPage } from "@/page/city";
import { CmsPage } from "@/page/cms";
import { CountryPage } from "@/page/country";
import { DestinationsPage } from "@/page/destinations";
import { RegionPage } from "@/page/region";

import { mapCmsBlocks } from "@/cms/lib";
import { type TGeoRoute, resolveAppRoute } from "@/cms/routing";

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

	const slug = geo?.[0] ?? route.document.slug ?? "";

	return createCmsPageMetadata({
		seo: route.document.seo ?? {},

		locale,

		path: buildCmsPath(route.document.slug ?? slug)
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

		if (route.kind === "country") {
			return (
				<CountryPage
					sections={sections}
					breadcrumbItems={breadcrumbItems}
				/>
			);
		}

		if (route.kind === "region") {
			return (
				<RegionPage
					sections={sections}
					breadcrumbItems={breadcrumbItems}
				/>
			);
		}

		if (route.kind === "city") {
			return (
				<CityPage
					sections={sections}
					breadcrumbItems={breadcrumbItems}
				/>
			);
		}

		if (route.kind === "attraction") {
			return (
				<AttractionPage
					sections={sections}
					breadcrumbItems={breadcrumbItems}
				/>
			);
		}

		notFound();
	}

	const sections = mapCmsBlocks(route.document.blocks);

	if (route.kind === "destination") {
		return <DestinationsPage sections={sections} />;
	}

	return <CmsPage sections={sections} />;
}
