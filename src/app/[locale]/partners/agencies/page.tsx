import { setRequestLocale } from "next-intl/server";

import { PartnersAgenciesPage } from "@/page/partners-agencies";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function AgenciesRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <PartnersAgenciesPage />;
}
