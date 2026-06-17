import { getTranslations } from "next-intl/server";

import { CardRender, CardVariant, CustomSectionHeader } from "@/shared/ui";

import { MAIN_JOURNAL_CONFIG } from "../model";

export async function JournalSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("journal.eyebrow")}
				title={t("journal.title")}
				description={t("journal.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{MAIN_JOURNAL_CONFIG.map((item) => (
					<CardRender
						key={item.id}
						variant={CardVariant.Journal}
						item={{
							imageUrl: item.imageUrl,
							meta: t(item.i18n.meta),
							title: t(item.i18n.title)
						}}
					/>
				))}
			</div>
		</section>
	);
}
