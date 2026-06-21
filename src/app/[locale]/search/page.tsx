import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { SearchPage } from "@/page/search";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "search_page" });

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.MAIN.SEARCH
	});
}

export default async function SearchRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <SearchPage />;
}
