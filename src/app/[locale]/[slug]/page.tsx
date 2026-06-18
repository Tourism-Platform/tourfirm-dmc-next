import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { buildCmsPath, createCmsPageMetadata } from "@/shared/lib";

import { CmsPage } from "@/page/cms";
import { DestinationsPage } from "@/page/destinations";

import { mapCmsBlocks } from "@/cms/lib";
import { resolveCmsRoute } from "@/cms/routing/resolve-cms-route";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const route = await resolveCmsRoute(locale, slug);

	if (!route) {
		return {};
	}

	return createCmsPageMetadata({
		seo: route.document.seo ?? {},
		locale,
		path: buildCmsPath(route.document.slug ?? slug)
	});
}

export default async function CmsSlugRoute({ params }: TProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const route = await resolveCmsRoute(locale, slug);

	if (!route) {
		notFound();
	}

	const sections = mapCmsBlocks(route.document.blocks);

	if (route.kind === "destination") {
		return <DestinationsPage sections={sections} />;
	}

	return <CmsPage sections={sections} />;
}
