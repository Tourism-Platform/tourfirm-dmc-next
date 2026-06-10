"use client";

import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { AboutCtaSection } from "./about-cta-section";
import { AboutHero } from "./about-hero";
import { AboutHistorySection } from "./about-history-section";
import { AboutIntroSection } from "./about-intro-section";
import { AboutMissionSection } from "./about-mission-section";
import { AboutWhySection } from "./about-why-section";

const CompanyAboutBase: FC = () => (
	<div className="flex flex-col">
		<AboutHero />
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
			<AboutIntroSection />
			<AboutMissionSection />
			<AboutWhySection />
			<AboutHistorySection />
			<AboutCtaSection />
		</div>
	</div>
);

export const CompanyAbout = withErrorBoundary(CompanyAboutBase);
