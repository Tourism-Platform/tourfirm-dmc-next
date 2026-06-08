import { setRequestLocale } from "next-intl/server";

import { CompanyAboutPage } from "@/page/company-about";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function AboutRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyAboutPage />;
}
