"use client";

import { type FC } from "react";

import { Previewer, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourData } from "@/entities/tour";

interface IPreviewTourOverviewProps {
	data?: IPreviewTourData;
}

const PreviewTourOverviewBase: FC<IPreviewTourOverviewProps> = ({ data }) => {
	const { preview } = useUiContent();

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{preview.tour.sections.overview.title}
			</h2>
			<Previewer text={data.description} />
		</div>
	);
};

export const PreviewTourOverview = withErrorBoundary(PreviewTourOverviewBase);
