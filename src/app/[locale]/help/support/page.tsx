import { setRequestLocale } from "next-intl/server";

import { HelpSupportPage } from "@/page/help-support";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function SupportRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpSupportPage />;
}
