import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib/seo";
import { loadUiContent } from "@/shared/ui-content/server";

import { CatalogPage } from "@/page/catalog";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const uiContent = await loadUiContent(locale);

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

	return <CatalogPage locale={locale} />;
}
