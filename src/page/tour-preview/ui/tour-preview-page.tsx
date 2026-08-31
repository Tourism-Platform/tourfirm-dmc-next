"use client";

import { PreviewTour } from "@/widgets/tour-preview";

type TProps = {
	slug: string;
};

export function TourPreviewPage({ slug }: TProps) {
	return <PreviewTour slug={slug} />;
}
