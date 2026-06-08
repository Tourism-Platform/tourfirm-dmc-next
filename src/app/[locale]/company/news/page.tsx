import { setRequestLocale } from "next-intl/server";

import { CompanyNewsPage } from "@/page/company-news";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function NewsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyNewsPage />;
}
