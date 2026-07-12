import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildNewsDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";

import { findNewsBySlug } from "@/cms/api";
import { mapCmsBlocks } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const item = await findNewsBySlug(locale, slug);

	if (!item) {
		return {};
	}

	return createCmsPageMetadata({
		seo: item.seo ?? {},
		locale,
		path: `/company/news/${slug}`
	});
}

export default async function NewsDetailRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const item = await findNewsBySlug(locale, slug);

	if (!item) {
		notFound();
	}

	return (
		<Cms
			sections={mapCmsBlocks(item.blocks)}
			breadcrumbItems={buildNewsDetailBreadcrumbs(item.title, item.slug)}
		/>
	);
}
