import { setRequestLocale } from "next-intl/server";

import { HelpMoreInfoPage } from "@/page/help-more-info";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function MoreInfoRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpMoreInfoPage />;
}
