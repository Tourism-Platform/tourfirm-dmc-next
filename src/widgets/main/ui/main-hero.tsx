import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomPageHero } from "@/shared/ui";

import { SearchToursBar } from "@/features/tours";

import { MAIN_HERO_IMAGE } from "../model";

export async function MainHero() {
	const t = await getTranslations("main_page");

	return (
		<CustomPageHero
			imageSrc={MAIN_HERO_IMAGE}
			imageAlt={t("hero.title")}
			size="tall"
			title={
				<>
					{t("hero.title")}{" "}
					<span className="text-primary italic normal-case">
						{t("hero.title_accent")}
					</span>
				</>
			}
			description={t("hero.description")}
			note={t("hero.note")}
			actions={
				<>
					<Button asChild variant="secondary">
						<Link href={ENUM_PATH.HELP.CONTACT}>
							{t("hero.cta_contact")}
						</Link>
					</Button>
					<Button asChild>
						<Link href={ENUM_PATH.MAIN.DESTINATIONS}>
							{t("hero.cta_destinations")}
						</Link>
					</Button>
				</>
			}
		>
			<SearchToursBar className="shadow-lg" />
		</CustomPageHero>
	);
}
