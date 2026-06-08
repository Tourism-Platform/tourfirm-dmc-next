import { setRequestLocale } from "next-intl/server";

import { CompanyHowWeWorkPage } from "@/page/company-how-we-work";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function HowWeWorkRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyHowWeWorkPage />;
}
