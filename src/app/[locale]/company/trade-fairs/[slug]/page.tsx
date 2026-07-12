import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildTradeFairDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";

import { findTradeFairBySlug } from "@/cms/api";
import { mapCmsBlocks } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const tradeFair = await findTradeFairBySlug(locale, slug);

	if (!tradeFair) {
		return {};
	}

	return createCmsPageMetadata({
		seo: tradeFair.seo ?? {},
		locale,
		path: ENUM_PATH.COMPANY.tradeFairDetail(slug)
	});
}

export default async function TradeFairDetailRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const tradeFair = await findTradeFairBySlug(locale, slug);

	if (!tradeFair) {
		notFound();
	}

	return (
		<Cms
			sections={mapCmsBlocks(tradeFair.blocks)}
			breadcrumbItems={buildTradeFairDetailBreadcrumbs(
				tradeFair.title,
				tradeFair.slug
			)}
		/>
	);
}
