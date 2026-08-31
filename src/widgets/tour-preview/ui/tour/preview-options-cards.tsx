"use client";

import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

import { PreviewOptionCard } from "./preview-option-card";

type TPreviewOptionsCardsProps = {
	slug: string;
	options: IPreviewOptionCard[];
};

const PreviewOptionsCardsBase: FC<TPreviewOptionsCardsProps> = ({
	slug,
	options
}) => {
	const { preview } = useUiContent();
	const texts = preview.tour.sections.itinerary;

	if (!options.length) return null;

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h3 className="mb-2 text-2xl font-bold">{texts.title}</h3>
				<p className="text-muted-foreground text-sm">
					{texts.subtitle}
				</p>
			</div>

			<div className="flex flex-col gap-6">
				{options.map((option) => (
					<PreviewOptionCard
						key={option.id}
						slug={slug}
						option={option}
					/>
				))}
			</div>
		</div>
	);
};

export const PreviewOptionsCards = withErrorBoundary(PreviewOptionsCardsBase);
