import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

export async function AboutMissionSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-8 sm:gap-10">
			<div className="flex flex-col gap-4">
				<CustomSectionHeader
					eyebrow={t("mission.eyebrow")}
					title={t("mission.title")}
					description={t("mission.description")}
				/>
			</div>

			<blockquote className="border-primary text-muted-foreground max-w-3xl border-l-4 pl-4 text-sm italic sm:text-base">
				{t("mission.quote")}
			</blockquote>

			<div className="flex flex-col gap-4">
				<CustomSectionHeader
					eyebrow={t("vision.eyebrow")}
					title={t("vision.title")}
					description={t("vision.description")}
				/>
			</div>
		</section>
	);
}
