import { setRequestLocale } from "next-intl/server";

import { CompanyPartnershipPage } from "@/page/company-partnership";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function PartnershipRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyPartnershipPage />;
}
