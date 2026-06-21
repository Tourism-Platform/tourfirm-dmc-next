import { type FC } from "react";

import { UploadImagesPreviewer, withErrorBoundary } from "@/shared/ui";

import type { ICatalogPreviewTourData } from "@/entities/tour/catalog";

interface ICatalogTourPhotosProps {
	data?: ICatalogPreviewTourData;
}

const CatalogTourPhotosBase: FC<ICatalogTourPhotosProps> = ({ data }) => {
	if (!data?.images.length) return null;

	return (
		<UploadImagesPreviewer
			images={data.images.slice(0, 5)}
			showPrimaryBadge
		/>
	);
};

export const CatalogTourPhotos = withErrorBoundary(CatalogTourPhotosBase);
