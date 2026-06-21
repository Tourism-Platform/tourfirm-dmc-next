import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { CatalogPage } from "@/page/catalog";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "catalog_page" });

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.MAIN.CATALOG.ROOT
	});
}

export default async function CatalogRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CatalogPage />;
}
