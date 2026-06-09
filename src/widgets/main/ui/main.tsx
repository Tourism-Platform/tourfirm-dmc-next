"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";

import { type TSearchTours, searchToursSchema } from "@/entities/tour";

import { CountriesSection } from "./countries-section";
import { ExperiencesSection } from "./experiences-section";
import { FeaturedRoutesSection } from "./featured-routes-section";
import { HowWeWorkSection } from "./how-we-work-section";
import { JournalSection } from "./journal-section";
import { MainCta } from "./main-cta";
import { MainHero } from "./main-hero";
import { OverviewStatsSection } from "./overview-stats-section";
import { TradeFairsSection } from "./trade-fairs-section";
import { TripFormatsSection } from "./trip-formats-section";
import { WhySection } from "./why-section";

const MainBase: FC = () => {
	const searchForm = useForm<TSearchTours>({
		resolver: zodResolver(searchToursSchema),
		defaultValues: {
			destination: "",
			dates: undefined
		}
	});

	return (
		<div className="flex flex-col">
			<MainHero form={searchForm} />
			<OverviewStatsSection />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pt-16 sm:gap-14 sm:px-6 sm:pt-20 lg:gap-16 lg:px-8">
				<CountriesSection />
				<ExperiencesSection />
				<TripFormatsSection />
				<HowWeWorkSection />
				<FeaturedRoutesSection />
				<WhySection />
				<TradeFairsSection />
				<JournalSection />
				<MainCta />
			</div>
		</div>
	);
};

export const Main = withErrorBoundary(MainBase);
