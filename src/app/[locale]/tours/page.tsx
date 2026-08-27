import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createCmsPageMetadata, createPageMetadata } from "@/shared/lib/seo";
import { loadUiContent } from "@/shared/ui-content/server";

import { ToursPage } from "@/page/tours";

import { getTours } from "@/cms/api/get-tours";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const dynamic = "force-static";
export const revalidate = 60;

type TProps = {
	params: Promise<{
		locale: TypedLocale;
	}>;
};
export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const [catalog, uiContent] = await Promise.all([
		getTours(locale),
		loadUiContent(locale)
	]);
	if (catalog?.seo) {
		return createCmsPageMetadata({
			seo: catalog.seo as Parameters<
				typeof createCmsPageMetadata
			>[0]["seo"],
			locale,
			path: ENUM_PATH.MAIN.TOURS
		});
	}
	return createPageMetadata({
		title: uiContent.tours.meta.title,
		description: uiContent.tours.meta.description,
		locale,
		path: ENUM_PATH.MAIN.TOURS
	});
}
export default async function ToursRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const catalog = await getTours(locale);
	const blocks = resolveBlockData(
		(catalog?.blocks ?? []) as Parameters<typeof resolveBlockData>[0],
		{
			document: {},
			locale
		}
	);
	const sections = await mapCmsBlocks(blocks);
	return <ToursPage locale={locale} sections={sections} />;
}
