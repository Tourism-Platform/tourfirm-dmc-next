"use client";

import { type FC } from "react";

import { UploadImagesPreviewer, withErrorBoundary } from "@/shared/ui";

import type { IPreviewTourData } from "@/entities/tour";

interface IPreviewTourPhotosProps {
	data?: IPreviewTourData;
}

const PreviewTourPhotosBase: FC<IPreviewTourPhotosProps> = ({ data }) => {
	if (!data?.images.length) return null;

	return (
		<UploadImagesPreviewer
			images={data.images.slice(0, 5)}
			showPrimaryBadge
		/>
	);
};

export const PreviewTourPhotos = withErrorBoundary(PreviewTourPhotosBase);
