import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { createPageMetadata } from "@/shared/lib/seo";
import {
	getDropdownLanguages,
	getLocaleAvailability,
	loadUiContent
} from "@/shared/ui-content/server";

import { LoginPage } from "@/page/login";

export const dynamic = "force-dynamic";

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const uiContent = await loadUiContent(locale);

	return createPageMetadata({
		title: uiContent.login.meta.title,
		description: uiContent.login.meta.description,
		locale,
		path: ENUM_PATH.AUTH.LOGIN
	});
}

export default async function LoginRoute({ params }: TProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const availability = await getLocaleAvailability();
	const languages = getDropdownLanguages(availability);

	return <LoginPage languages={languages} />;
}
