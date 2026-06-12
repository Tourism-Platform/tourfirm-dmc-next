import { getTranslations } from "next-intl/server";

import { CustomPageHero } from "@/shared/ui";

import { CONTACT_HERO_IMAGE } from "../model";

export async function ContactHero() {
	const t = await getTranslations("help_contact_page");

	return (
		<CustomPageHero
			imageSrc={CONTACT_HERO_IMAGE}
			imageAlt={t("hero.title")}
			title={t("hero.title")}
			description={t("hero.description")}
		/>
	);
}
