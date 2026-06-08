import { setRequestLocale } from "next-intl/server";

import { LegalTermsPage } from "@/page/legal-terms";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function TermsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <LegalTermsPage />;
}
