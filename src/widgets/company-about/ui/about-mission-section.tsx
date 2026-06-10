"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { AboutSectionHeader } from "./about-section-header";

const AboutMissionSectionBase: FC = () => {
	const t = useTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<AboutSectionHeader
				eyebrow={t("mission.eyebrow")}
				title={t("mission.title")}
				description={t("mission.description")}
			/>
			<blockquote className="border-primary text-muted-foreground max-w-3xl border-l-4 pl-4 text-sm italic sm:text-base">
				{t("mission.quote")}
			</blockquote>
			<p className="text-sm font-semibold">{t("mission.signature")}</p>
		</section>
	);
};

export const AboutMissionSection = withErrorBoundary(AboutMissionSectionBase);
