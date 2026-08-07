"use client";

import { PreviewOption } from "@/widgets/catalog-tour-preview";

type TProps = {
	tourId: string;
	optionId: string;
};

export function CatalogTourOptionPreviewPage({ tourId, optionId }: TProps) {
	return <PreviewOption tourId={tourId} optionId={optionId} />;
}
