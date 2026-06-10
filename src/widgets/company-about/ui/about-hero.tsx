"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { ABOUT_HERO_IMAGE } from "../model";

const AboutHeroBase: FC = () => {
	const t = useTranslations("company_about_page");

	return (
		<section className="relative min-h-[400px] sm:min-h-[480px]">
			<Image
				src={ABOUT_HERO_IMAGE}
				alt={t("hero.title")}
				fill
				priority
				className="object-cover object-[center_40%] brightness-[0.85] saturate-[1.2]"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-7xl flex-col justify-end gap-4 px-4 py-16 sm:min-h-[480px] sm:gap-6 sm:px-6 sm:py-20 lg:px-8">
				<div className="flex max-w-3xl flex-col gap-4 text-white">
					<h1 className="text-3xl font-semibold uppercase leading-tight sm:text-4xl lg:text-5xl">
						{t("hero.title")}{" "}
						<span className="text-primary italic normal-case">
							{t("hero.title_accent")}
						</span>
					</h1>
					<p className="text-sm text-white/90 sm:text-base">
						{t("hero.description")}
					</p>
				</div>
			</div>
		</section>
	);
};

export const AboutHero = withErrorBoundary(AboutHeroBase);
