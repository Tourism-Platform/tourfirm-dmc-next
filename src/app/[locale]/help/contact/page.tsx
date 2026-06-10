import { getTranslations, setRequestLocale } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib";

import { HelpContactPage } from "@/page/help-contact";

export const dynamic = "force-static";

type TProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "help_contact_page"
	});

	return createPageMetadata({
		title: t("meta.title"),
		description: t("meta.description"),
		locale,
		path: ENUM_PATH.HELP.CONTACT
	});
}

export default async function ContactRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return <HelpContactPage />;
}
