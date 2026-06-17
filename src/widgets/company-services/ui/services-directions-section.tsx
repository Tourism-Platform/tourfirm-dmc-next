import { getTranslations } from "next-intl/server";

import { CustomSectionHeader, ServicesDirectionCard } from "@/shared/ui";

import { SERVICES_DIRECTIONS_CONFIG } from "../model";

export async function ServicesDirectionsSection() {
	const t = await getTranslations("company_services_page");

	return (
		<section
			id="directions"
			className="flex scroll-mt-24 flex-col gap-6 sm:gap-8"
		>
			<CustomSectionHeader
				eyebrow={t("directions.eyebrow")}
				title={t("directions.title")}
				description={t("directions.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{SERVICES_DIRECTIONS_CONFIG.map((item) => (
					<ServicesDirectionCard
						key={item.id}
						imageSrc={item.imageUrl}
						imageAlt={t(item.i18n.title)}
						title={t(item.i18n.title)}
						description={t(item.i18n.description)}
						cta={t(item.i18n.cta)}
					/>
				))}
			</div>
		</section>
	);
}
