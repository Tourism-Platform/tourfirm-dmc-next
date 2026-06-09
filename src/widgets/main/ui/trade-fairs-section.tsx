"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { TradeFairCard } from "@/entities/tour";

import { MAIN_TRADE_FAIRS_CONFIG } from "../model";

import { MainSectionHeader } from "./main-section-header";

const TradeFairsSectionBase: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<MainSectionHeader
				eyebrow={t("trade_fairs.eyebrow")}
				title={t("trade_fairs.title")}
				description={t("trade_fairs.description")}
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{MAIN_TRADE_FAIRS_CONFIG.map((item) => (
					<TradeFairCard
						key={item.id}
						data={{
							title: t(item.i18n.title),
							stand: t(item.i18n.stand),
							participants: t(item.i18n.participants),
							country: t(item.i18n.country)
						}}
					/>
				))}
			</div>
		</section>
	);
};

export const TradeFairsSection = withErrorBoundary(TradeFairsSectionBase);
