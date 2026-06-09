"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { Button } from "@/shared/ui";

import { DESTINATIONS_HERO_IMAGE } from "../model";

export const DestinationsHero: FC = () => {
	const t = useTranslations("destinations_page");

	return (
		<section className="relative min-h-[480px] sm:min-h-[560px]">
			<Image
				src={DESTINATIONS_HERO_IMAGE}
				alt={t("hero.title")}
				fill
				priority
				className="object-cover object-[center_40%] brightness-[0.85] saturate-[1.2]"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-7xl flex-col justify-end gap-6 px-4 py-16 sm:min-h-[560px] sm:gap-8 sm:px-6 sm:py-20 lg:px-8">
				<div className="flex max-w-3xl flex-col gap-4 text-white">
					{/* <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
						{t("hero.eyebrow")}
					</p> */}
					<h1 className="text-3xl font-semibold uppercase leading-tight sm:text-4xl lg:text-5xl">
						{t("hero.title")}{" "}
						<span className="text-primary italic normal-case">
							{t("hero.title_accent")}
						</span>
					</h1>
					<p className="text-sm text-white/90 sm:text-base">
						{t("hero.description")}
					</p>
					<p className="text-sm text-white/75 sm:text-base">
						{t("hero.note")}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button asChild variant="secondary">
						<a href="#countries">{t("hero.cta_countries")}</a>
					</Button>
					<Button asChild>
						<Link
							href={buildRouteWithQuery(ENUM_PATH.MAIN.CATALOG, {
								destination: "Uzbekistan"
							})}
						>
							{t("hero.cta_uzbekistan")}
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};
