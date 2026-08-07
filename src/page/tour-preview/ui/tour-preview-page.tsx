"use client";

import { PreviewTour } from "@/widgets/tour-preview";

type TProps = {
	tourId: string;
};

export function TourPreviewPage({ tourId }: TProps) {
	return <PreviewTour tourId={tourId} />;
}
