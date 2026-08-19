"use client";

import { type FC } from "react";

import { UploadImagesPreviewer } from "@/shared/ui";

import type { IOptionEventSheetImage } from "@/entities/tour/preview-tour";

interface IOptionEventSheetGalleryProps {
	images: IOptionEventSheetImage[];
}

export const OptionEventSheetGallery: FC<IOptionEventSheetGalleryProps> = ({
	images
}) => {
	if (!images.length) return null;

	return (
		<UploadImagesPreviewer
			images={images.slice(0, 5).map((image) => image.imagePath)}
			gridHeight={220}
			showPrimaryBadge={false}
		/>
	);
};
