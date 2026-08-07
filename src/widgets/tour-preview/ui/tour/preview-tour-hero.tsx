"use client";

import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourGeneral } from "@/entities/tour/preview-tour";

import { HERO_INFO } from "../../model";

type TPreviewTourHeroProps = {
	tour?: IPreviewTourGeneral;
	locale: string;
};

const PreviewTourHeroBase: FC<TPreviewTourHeroProps> = ({ tour, locale }) => {
	const { preview } = useUiContent();

	if (!tour) return null;

	const heroData = HERO_INFO(tour, preview.tour.hero, locale);

	return (
		<div className="flex flex-col gap-4 self-center">
			<h1 className="text-3xl font-bold">{tour.tourTitle}</h1>
			<div className="text-muted-foreground flex items-center gap-6 text-sm">
				{heroData.map((item) => (
					<span
						key={item.label}
						className="flex items-center gap-1.5"
					>
						<item.icon className="size-4" />
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
};

export const PreviewTourHero = withErrorBoundary(PreviewTourHeroBase);
