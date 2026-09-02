"use client";

import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";

import { CustomPageHero, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { TSearchTours } from "@/entities/tour";

import { SearchToursBar } from "@/features/tours";

const HERO_IMAGE = "/assets/images/hero-image.jpg";

type TCatalogHeroSectionProps = {
	form: UseFormReturn<TSearchTours>;
	onSubmit?: (data: TSearchTours) => void;
};

const CatalogHeroSectionBase: FC<TCatalogHeroSectionProps> = ({
	form,
	onSubmit
}) => {
	const { catalog } = useUiContent();

	return (
		<CustomPageHero
			imageSrc={HERO_IMAGE}
			imageAlt={catalog.hero.title}
			title={catalog.hero.title}
		>
			<SearchToursBar
				form={form}
				onSubmit={onSubmit}
				className="translate-y-1/2 shadow-lg"
			/>
		</CustomPageHero>
	);
};

export const CatalogHeroSection = withErrorBoundary(CatalogHeroSectionBase);
