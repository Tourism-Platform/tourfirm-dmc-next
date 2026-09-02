"use client";

import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";

import { CustomPageHero, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { TSearchTours } from "@/entities/tour";

import { SearchToursBar } from "@/features/tours";

const HERO_IMAGE = "/assets/images/hero-image.jpg";

type THeroSectionProps = {
	form: UseFormReturn<TSearchTours>;
};

const HeroSectionBase: FC<THeroSectionProps> = ({ form }) => {
	const { tours } = useUiContent();

	return (
		<CustomPageHero
			imageSrc={HERO_IMAGE}
			imageAlt={tours.hero.title}
			title={tours.hero.title}
		>
			<SearchToursBar form={form} className="translate-y-1/2 shadow-lg" />
		</CustomPageHero>
	);
};

export const HeroSection = withErrorBoundary(HeroSectionBase);
