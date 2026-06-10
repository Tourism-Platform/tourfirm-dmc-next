import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { CompanyServicesPage } from "@/page/company-services";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "company_services_page"
	});

	return {
		title: t("meta.title"),
		description: t("meta.description")
	};
}

export default async function ServicesRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyServicesPage />;
}
