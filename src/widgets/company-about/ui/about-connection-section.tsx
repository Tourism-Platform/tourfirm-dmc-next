import {
	ArrowLeftRight,
	Briefcase,
	Globe2,
	Link2,
	Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

import { DestinationInsightCard } from "@/entities/tour";

import { ABOUT_CONNECTION_CONFIG, type TAboutConnectionId } from "../model";

const CONNECTION_ICONS: Record<TAboutConnectionId, LucideIcon> = {
	geography: Globe2,
	experience: Sparkles,
	business: Briefcase,
	access: Link2,
	generations: ArrowLeftRight
};

export async function AboutConnectionSection() {
	const t = await getTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("connection.eyebrow")}
				title={t("connection.title")}
				description={t("connection.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{ABOUT_CONNECTION_CONFIG.map((item) => (
					<DestinationInsightCard
						key={item.id}
						data={{
							icon: CONNECTION_ICONS[item.id],
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
}
