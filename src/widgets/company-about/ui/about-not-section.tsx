import { getTranslations } from "next-intl/server";

import { AboutNotUsItemCard, CustomSectionHeader } from "@/shared/ui";

import { ABOUT_NOT_US_CONFIG } from "../model";

export async function AboutNotSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("not_us.eyebrow")}
				title={t("not_us.title")}
				description={t("not_us.description")}
			/>
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{ABOUT_NOT_US_CONFIG.map((item) => (
					<AboutNotUsItemCard
						key={item.id}
						not={t(item.i18n.not)}
						because={t(item.i18n.because)}
					/>
				))}
			</ul>
		</section>
	);
}
