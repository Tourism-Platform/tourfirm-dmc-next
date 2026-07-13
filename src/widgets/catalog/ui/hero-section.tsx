"use client";

import Image from "next/image";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { TSearchTours } from "@/entities/tour";

import { SearchToursBar } from "@/features/tours";

const HERO_IMAGE = "/assets/images/hero-image.jpg";

interface IHeroSectionProps {
	form: UseFormReturn<TSearchTours>;
}

const HeroSectionBase: FC<IHeroSectionProps> = ({ form }) => {
	const { catalog } = useUiContent();

	return (
		<section className="relative min-h-[420px] sm:min-h-[520px]">
			<Image
				src={HERO_IMAGE}
				alt={catalog.hero.title}
				fill
				priority
				className="object-cover object-[center_60%] brightness-[0.85] saturate-[1.2]"
				sizes="100vw"
			/>
			<div className="absolute inset-0 z-[1] bg-black/40" />
			<h1 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-4xl tracking-wide text-white uppercase sm:text-5xl lg:text-6xl xl:text-7xl">
				{catalog.hero.title}
			</h1>
			<div className="relative z-20 flex min-h-[420px] flex-col justify-end sm:min-h-[520px]">
				<div className="mx-auto w-full max-w-7xl px-4 pb-0 sm:px-6 lg:px-8">
					<SearchToursBar
						form={form}
						className="-mb-10 shadow-lg sm:-mb-12"
					/>
				</div>
			</div>
		</section>
	);
};

export const HeroSection = withErrorBoundary(HeroSectionBase);
