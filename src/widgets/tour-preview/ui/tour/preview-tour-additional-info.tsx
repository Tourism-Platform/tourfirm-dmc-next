"use client";

import { type FC } from "react";

import { Previewer, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourData } from "@/entities/tour/preview-tour";

interface IPreviewTourAdditionalInfoProps {
	data?: IPreviewTourData;
}

const PreviewTourAdditionalInfoBase: FC<IPreviewTourAdditionalInfoProps> = ({
	data
}) => {
	const { preview } = useUiContent();

	if (!data) return null;

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">
				{preview.tour.sections.additionalInfo.title}
			</h2>
			<Previewer text={data.additional_info} />
		</div>
	);
};

export const PreviewTourAdditionalInfo = withErrorBoundary(
	PreviewTourAdditionalInfoBase
);
