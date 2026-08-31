"use client";

import { PreviewOption } from "@/widgets/tour-preview";

type TProps = {
	slug: string;
	optionId: string;
};

export function TourOptionPreviewPage({ slug, optionId }: TProps) {
	return <PreviewOption slug={slug} optionId={optionId} />;
}
