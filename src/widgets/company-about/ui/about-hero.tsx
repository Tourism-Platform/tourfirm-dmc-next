import { getTranslations } from "next-intl/server";

import { CustomPageHero } from "@/shared/ui";

import { ABOUT_HERO_IMAGE } from "../model";

export async function AboutHero() {
	const t = await getTranslations("company_about_page");

	return (
		<CustomPageHero
			imageSrc={ABOUT_HERO_IMAGE}
			imageAlt={t("hero.title")}
			title={
				<>
					{t("hero.title")}{" "}
					<span className="text-primary italic normal-case">
						{t("hero.title_accent")}
					</span>
				</>
			}
			description={t("hero.description")}
		/>
	);
}
