import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { CatalogTourOptionPage } from "@/page/catalog-tour-option";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string; tourId: string; optionId: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, tourId, optionId } = await params;
	const t = await getTranslations({
		locale,
		namespace: "catalog_tour_option_page"
	});

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: buildRoute(ENUM_PATH.MAIN.CATALOG.TOUR_OPTION, {
			tourId,
			optionId
		})
	});
}

export default async function CatalogTourOptionRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CatalogTourOptionPage />;
}
