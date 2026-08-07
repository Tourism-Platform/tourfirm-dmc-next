"use client";

import { type FC } from "react";

import { Separator } from "@/shared/ui";

import type { IPreviewTourData } from "@/entities/tour";

import { PreviewTourAdditionalInfo } from "./preview-tour-additional-info";
import { PreviewTourAmenities } from "./preview-tour-amenities";
import { PreviewTourCancellation } from "./preview-tour-cancellation";
import { PreviewTourMeta } from "./preview-tour-meta";
import { PreviewTourOverview } from "./preview-tour-overview";
import { PreviewTourPhotos } from "./preview-tour-photos";
import { PreviewTourPickup } from "./preview-tour-pickup";

interface IPreviewTourInformationSectionsProps {
	data?: IPreviewTourData;
}

export const PreviewTourInformationSections: FC<
	IPreviewTourInformationSectionsProps
> = ({ data }) => {
	if (!data) return null;

	return (
		<div className="flex flex-col gap-8">
			<PreviewTourPhotos data={data} />
			<Separator />
			<PreviewTourOverview data={data} />
			<Separator />
			<PreviewTourMeta data={data} />
			<Separator />
			<PreviewTourAmenities data={data} />
			<Separator />
			<PreviewTourPickup data={data} />
			<Separator />
			<PreviewTourCancellation data={data} />
			<Separator />
			<PreviewTourAdditionalInfo data={data} />
		</div>
	);
};
