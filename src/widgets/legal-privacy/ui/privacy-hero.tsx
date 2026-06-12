import { getTranslations } from "next-intl/server";

import { CustomPageHero } from "@/shared/ui";

import { PRIVACY_HERO_IMAGE } from "../model";

export async function PrivacyHero() {
	const t = await getTranslations("legal_privacy_page");

	return (
		<CustomPageHero
			imageSrc={PRIVACY_HERO_IMAGE}
			imageAlt={t("hero.title")}
			title={t("hero.title")}
			description={t("hero.description")}
		/>
	);
}
