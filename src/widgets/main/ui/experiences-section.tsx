import { getTranslations } from "next-intl/server";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { MAIN_EXPERIENCES_CONFIG } from "../model";

export async function ExperiencesSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("experiences.eyebrow")}
				title={t("experiences.title")}
				description={t("experiences.description")}
			/>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{MAIN_EXPERIENCES_CONFIG.map((item) => (
					<CardRender
						key={item.id}
						variant={CardVariant.Experience}
						item={{
							imageUrl: item.imageUrl,
							badge: t(item.i18n.badge),
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
}
