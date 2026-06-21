import { getTranslations } from "next-intl/server";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button, CustomPageHero } from "@/shared/ui";

import { DESTINATIONS_HERO_IMAGE } from "../model";

export async function DestinationsHero() {
	const t = await getTranslations("destinations_page");

	return (
		<CustomPageHero
			imageSrc={DESTINATIONS_HERO_IMAGE}
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
						<a href="#countries">{t("hero.cta_countries")}</a>
					</Button>
					<Button asChild>
						<Link
							href={buildRouteWithQuery(ENUM_PATH.MAIN.SEARCH, {
								destination: "Uzbekistan"
							})}
						>
							{t("hero.cta_uzbekistan")}
						</Link>
					</Button>
				</>
			}
		/>
	);
}
