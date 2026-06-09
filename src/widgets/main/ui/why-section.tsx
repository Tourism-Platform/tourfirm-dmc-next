"use client";

import { Gauge, Link2, type LucideIcon, Route } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { DestinationInsightCard } from "@/entities/tour";

import { MAIN_WHY_CONFIG, type TMainWhyId } from "../model";

import { MainSectionHeader } from "./main-section-header";

const WHY_ICONS: Record<TMainWhyId, LucideIcon> = {
	programs: Route,
	rhythm: Gauge,
	connection: Link2
};

const WhySectionBase: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<MainSectionHeader
				eyebrow={t("why.eyebrow")}
				title={t("why.title")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{MAIN_WHY_CONFIG.map((item) => (
					<DestinationInsightCard
						key={item.id}
						data={{
							icon: WHY_ICONS[item.id],
							title: t(item.i18n.title),
							description: t(item.i18n.description)
						}}
					/>
				))}
			</div>
		</section>
	);
};

export const WhySection = withErrorBoundary(WhySectionBase);
