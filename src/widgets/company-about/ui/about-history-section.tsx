"use client";

import {
	Building2,
	Globe2,
	type LucideIcon,
	Map,
	Plane,
	RefreshCw,
	Sparkles,
	TrendingUp,
	Trophy,
	Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import {
	Timeline,
	TimelineContent,
	TimelineHeader,
	TimelineIndicator,
	TimelineItem,
	TimelineSeparator,
	withErrorBoundary
} from "@/shared/ui";

import { ABOUT_HISTORY_CONFIG, type TAboutHistoryId } from "../model";

import { AboutHistoryCard } from "./about-history-card";
import { AboutSectionHeader } from "./about-section-header";

const HISTORY_ICONS: Record<TAboutHistoryId, LucideIcon> = {
	founding: Plane,
	dmc: Building2,
	expansion: TrendingUp,
	rebuild: RefreshCw,
	fam_series: Map,
	market_leader: Trophy,
	fam_network: Users,
	global_presence: Globe2,
	tourlink: Sparkles
};

const AboutHistorySectionBase: FC = () => {
	const t = useTranslations("company_about_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<AboutSectionHeader
				eyebrow={t("history.eyebrow")}
				title={t("history.title")}
				description={t("history.description")}
			/>
			<p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
				{t("history.intro")}
			</p>
			<Timeline
				defaultValue={ABOUT_HISTORY_CONFIG.length}
				className="w-full"
			>
				{ABOUT_HISTORY_CONFIG.map((item, index) => {
					const Icon = HISTORY_ICONS[item.id];

					return (
						<TimelineItem
							key={item.id}
							step={index + 1}
							className="group-data-[orientation=vertical]/timeline:ms-14"
						>
							<TimelineHeader>
								<TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-9 group-data-[orientation=vertical]/timeline:h-[calc(100%-2.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-10" />
								<TimelineIndicator className="text-primary bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-10 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-9">
									<Icon className="size-5" />
								</TimelineIndicator>
							</TimelineHeader>
							<TimelineContent>
								<AboutHistoryCard
									year={t(item.i18n.year)}
									title={t(item.i18n.title)}
									description={t(item.i18n.description)}
								/>
							</TimelineContent>
						</TimelineItem>
					);
				})}
			</Timeline>
		</section>
	);
};

export const AboutHistorySection = withErrorBoundary(AboutHistorySectionBase);
