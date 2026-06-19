import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { LegalTermsPage } from "@/page/legal-terms";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "legal_terms_page"
	});

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.LEGAL.TERMS
	});
}

export default async function TermsRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <LegalTermsPage />;
}
