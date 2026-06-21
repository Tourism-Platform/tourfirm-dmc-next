import { getTranslations } from "next-intl/server";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { CustomSectionHeader } from "@/shared/ui";

import { CountryCard } from "@/entities/tour";

import { COUNTRIES_CONFIG } from "../model";

export async function CountriesGrid() {
	const t = await getTranslations("destinations_page");

	return (
		<section
			id="countries"
			className="flex scroll-mt-24 flex-col gap-6 sm:gap-8"
		>
			<CustomSectionHeader
				eyebrow={t("countries.eyebrow")}
				title={t("countries.title")}
				description={t("countries.description")}
			/>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
				{COUNTRIES_CONFIG.map((country) => (
					<CountryCard
						key={country.id}
						data={{
							href: buildRouteWithQuery(ENUM_PATH.MAIN.SEARCH, {
								destination: country.catalogDestination
							}),
							imageUrl: country.imageUrl,
							imageAlt: t(country.i18n.name),
							badge: t(country.i18n.badge),
							name: t(country.i18n.name),
							description: t(country.i18n.description),
							cities: country.i18n.cities.map((cityKey) =>
								t(cityKey)
							),
							featured: country.id === "uzbekistan"
						}}
					/>
				))}
			</div>
		</section>
	);
}
