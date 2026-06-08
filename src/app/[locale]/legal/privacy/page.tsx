import { setRequestLocale } from "next-intl/server";

import { LegalPrivacyPage } from "@/page/legal-privacy";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function PrivacyRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <LegalPrivacyPage />;
}
