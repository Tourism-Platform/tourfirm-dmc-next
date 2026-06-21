import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { CatalogTourPage } from "@/page/catalog-tour";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string; tourId: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, tourId } = await params;
	const t = await getTranslations({ locale, namespace: "catalog_tour_page" });

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: buildRoute(ENUM_PATH.MAIN.CATALOG.TOUR, { tourId })
	});
}

export default async function CatalogTourRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CatalogTourPage />;
}
