import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomPageHero } from "@/shared/ui";

import { SERVICES_HERO_IMAGE } from "../model";

export async function ServicesHero() {
	const t = await getTranslations("company_services_page");

	return (
		<CustomPageHero
			imageSrc={SERVICES_HERO_IMAGE}
			imageAlt={t("hero.title")}
			eyebrow={
				<p className="text-primary text-xs font-semibold uppercase tracking-widest">
					{t("hero.eyebrow")}
				</p>
			}
			title={
				<>
					{t("hero.title")}{" "}
					<span className="text-primary italic normal-case">
						{t("hero.title_accent")}
					</span>
				</>
			}
			subtitle={
				<p className="text-base font-medium text-white/95 sm:text-lg">
					{t("hero.subtitle")}
				</p>
			}
			description={t("hero.description")}
			actions={
				<>
					<Button asChild>
						<Link href={ENUM_PATH.HELP.CONTACT}>
							{t("hero.primary_cta")}
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
					>
						<a href="#directions">{t("hero.secondary_cta")}</a>
					</Button>
				</>
			}
		/>
	);
}
