import { getTranslations } from "next-intl/server";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { CardType, CardsSection } from "@/shared/ui";

import { MAIN_COUNTRIES_CONFIG } from "@/widgets/main/model";

export async function CountriesGrid() {
	const t = await getTranslations("main_page");
	return (
		<CardsSection
			eyebrow={t("countries.eyebrow")}
			title={t("countries.title")}
			description={t("countries.description")}
			gridClassName="sm:grid-cols-2 sm:gap-5 lg:gap-6"
			cards={MAIN_COUNTRIES_CONFIG.map((country) => ({
				key: country.id,
				type: CardType.Country,
				item: {
					href: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
						destination: country.catalogDestination
					}),
					imageUrl: country.imageUrl,
					badge: t(country.i18n.badge),
					title: t(country.i18n.name),
					description: t(country.i18n.description),
					cities: [],
					featured: country.id === "uzbekistan"
				}
			}))}
		/>
	);
}
