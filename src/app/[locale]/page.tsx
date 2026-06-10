import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { MainPage } from "@/page/main";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "main_page" });

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.MAIN.ROOT
	});
}

export default async function MainRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <MainPage />;
}
