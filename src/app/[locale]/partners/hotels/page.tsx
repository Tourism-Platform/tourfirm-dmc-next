import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { PartnersHotelsPage } from "@/page/partners-hotels";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "partners_hotels_page"
	});

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.PARTNERS.HOTELS
	});
}

export default async function HotelsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <PartnersHotelsPage />;
}
