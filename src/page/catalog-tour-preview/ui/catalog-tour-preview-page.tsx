"use client";

import { PreviewTour } from "@/widgets/catalog-tour-preview";

type TProps = {
	tourId: string;
};

export function CatalogTourPreviewPage({ tourId }: TProps) {
	return <PreviewTour tourId={tourId} />;
}
