"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { withErrorBoundary } from "@/shared/ui";

import { MAIN_HERO_IMAGE } from "../model";

import { MainSectionHeader } from "./main-section-header";

const HowWeWorkSectionBase: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<div className="flex flex-col gap-4">
					<MainSectionHeader
						eyebrow={t("how_we_work.eyebrow")}
						title={t("how_we_work.title")}
						description={t("how_we_work.description")}
					/>
					<blockquote className="border-primary text-muted-foreground border-l-4 pl-4 text-sm italic sm:text-base">
						{t("how_we_work.quote")}
					</blockquote>
					<p className="text-sm font-semibold">
						<span className="text-primary">
							{t("how_we_work.base_label")}
						</span>{" "}
						{t("how_we_work.base_value")}
					</p>
				</div>
				<div className="relative min-h-64 overflow-hidden rounded-2xl lg:min-h-80">
					<Image
						src={MAIN_HERO_IMAGE}
						alt={t("how_we_work.title")}
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>
		</section>
	);
};

export const HowWeWorkSection = withErrorBoundary(HowWeWorkSectionBase);
