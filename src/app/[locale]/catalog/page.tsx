import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createCmsPageMetadata, createPageMetadata } from "@/shared/lib/seo";
import { loadUiContent } from "@/shared/ui-content/server";

import { CatalogPage } from "@/page/catalog";

import { getCatalog } from "@/cms/api/get-catalog";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const [catalog, uiContent] = await Promise.all([
		getCatalog(locale),
		loadUiContent(locale)
	]);

	if (catalog?.seo) {
		return createCmsPageMetadata({
			seo: catalog.seo as Parameters<
				typeof createCmsPageMetadata
			>[0]["seo"],
			locale,
			path: ENUM_PATH.MAIN.CATALOG
		});
	}

	return createPageMetadata({
		title: uiContent.catalog.meta.title,
		description: uiContent.catalog.meta.description,
		locale,
		path: ENUM_PATH.MAIN.CATALOG
	});
}

export default async function CatalogRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const catalog = await getCatalog(locale);
	const blocks = resolveBlockData(
		(catalog?.blocks ?? []) as Parameters<typeof resolveBlockData>[0],
		{
			document: {},
			locale
		}
	);
	const sections = mapCmsBlocks(blocks);

	return <CatalogPage locale={locale} sections={sections} />;
}
