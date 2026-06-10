import { getTranslations } from "next-intl/server";

import { JournalCard } from "@/entities/tour";

import { MAIN_JOURNAL_CONFIG } from "../model";

import { MainSectionHeader } from "./main-section-header";

export async function JournalSection() {
	const t = await getTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<MainSectionHeader
				eyebrow={t("journal.eyebrow")}
				title={t("journal.title")}
				description={t("journal.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{MAIN_JOURNAL_CONFIG.map((item) => (
					<JournalCard
						key={item.id}
						statusLabel={t("journal.status")}
						data={{
							imageUrl: item.imageUrl,
							imageAlt: t(item.i18n.title),
							meta: t(item.i18n.meta),
							title: t(item.i18n.title),
							href: item.href
						}}
					/>
				))}
			</div>
		</section>
	);
}
