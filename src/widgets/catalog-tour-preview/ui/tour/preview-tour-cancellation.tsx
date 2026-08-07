"use client";

import { type FC } from "react";

import { Previewer, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourData } from "@/entities/tour";

interface IPreviewTourCancellationProps {
	data?: IPreviewTourData;
}

const PreviewTourCancellationBase: FC<IPreviewTourCancellationProps> = ({
	data
}) => {
	const { preview } = useUiContent();

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{preview.tour.sections.cancellation.title}
			</h2>
			<Previewer text={data.cancellation_policy} />
		</div>
	);
};

export const PreviewTourCancellation = withErrorBoundary(
	PreviewTourCancellationBase
);
