"use client";

import type { FC } from "react";

import { CountriesGrid } from "./countries-grid";
import { DestinationsCta } from "./destinations-cta";
import { DestinationsHero } from "./destinations-hero";
import { HowToChooseSection } from "./how-to-choose-section";
import { PlanningChecksSection } from "./planning-checks-section";
import { RouteIdeasSection } from "./route-ideas-section";
import { RouteMapSection } from "./route-map-section";

export const Destinations: FC = () => (
	<div className="flex flex-col">
		<DestinationsHero />
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
			<CountriesGrid />
			<HowToChooseSection />
			<RouteMapSection />
			<RouteIdeasSection />
			<PlanningChecksSection />
			<DestinationsCta />
		</div>
	</div>
);
