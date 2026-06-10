import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { CompanyAboutPage } from "@/page/company-about";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "company_about_page"
	});

	return {
		title: t("meta.title"),
		description: t("meta.description")
	};
}

export default async function AboutRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyAboutPage />;
}
