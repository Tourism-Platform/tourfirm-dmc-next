import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { MainPage } from "@/page/main";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "main_page" });

	return {
		title: t("meta.title"),
		description: t("meta.description")
	};
}

export default async function MainRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <MainPage />;
}
