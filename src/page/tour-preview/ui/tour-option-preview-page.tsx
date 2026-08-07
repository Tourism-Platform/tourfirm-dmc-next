"use client";

import { PreviewOption } from "@/widgets/tour-preview";

type TProps = {
	tourId: string;
	optionId: string;
};

export function TourOptionPreviewPage({ tourId, optionId }: TProps) {
	return <PreviewOption tourId={tourId} optionId={optionId} />;
}
