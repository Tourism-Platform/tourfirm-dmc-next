"use client";

import {
	Gauge,
	Globe2,
	type LucideIcon,
	MapPin,
	MessageCircle,
	Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { MAIN_OVERVIEW_STATS_CONFIG, type TOverviewStatId } from "../model";

import { OverviewStatCard } from "./overview-stat-card";

const STAT_ICONS: Record<TOverviewStatId, LucideIcon> = {
	base: MapPin,
	region: Globe2,
	planning: Gauge,
	formats: Users,
	communication: MessageCircle
};

const OverviewStatsSectionBase: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="border-b bg-muted/40">
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:gap-4 lg:py-8">
				{MAIN_OVERVIEW_STATS_CONFIG.map((stat) => {
					const Icon = STAT_ICONS[stat.id];

					return (
						<OverviewStatCard
							key={stat.id}
							icon={Icon}
							label={t(stat.i18n.label)}
							value={t(stat.i18n.value)}
						/>
					);
				})}
			</div>
		</section>
	);
};

export const OverviewStatsSection = withErrorBoundary(OverviewStatsSectionBase);
