import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

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

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.COMPANY.SERVICES
	});
}

export default async function ServicesRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <CompanyServicesPage />;
}
