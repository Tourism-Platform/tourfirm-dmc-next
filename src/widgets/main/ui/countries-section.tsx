import { getTranslations } from "next-intl/server";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { Link } from "@/shared/i18n";

import { CountryCard } from "@/entities/tour";

import { MAIN_COUNTRIES_CONFIG } from "../model";

import { MainSectionHeader } from "./main-section-header";

export async function CountriesSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<MainSectionHeader
					eyebrow={t("countries.eyebrow")}
					title={t("countries.title")}
					description={t("countries.description")}
				/>
				<Link
					href={ENUM_PATH.MAIN.DESTINATIONS}
					className="text-primary shrink-0 text-sm font-medium"
				>
					{t("countries.view_all")}
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
				{MAIN_COUNTRIES_CONFIG.map((country) => (
					<CountryCard
						key={country.id}
						data={{
							href: buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
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
