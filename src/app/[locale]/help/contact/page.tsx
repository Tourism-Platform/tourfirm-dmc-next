import { setRequestLocale } from "next-intl/server";

import { HelpContactPage } from "@/page/help-contact";

type TProps = {
	params: Promise<{ locale: string }>;
};

export default async function ContactRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpContactPage />;
}
