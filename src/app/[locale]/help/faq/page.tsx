import { setRequestLocale } from "next-intl/server";

import { HelpFaqPage } from "@/page/help-faq";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function FaqRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpFaqPage />;
}
