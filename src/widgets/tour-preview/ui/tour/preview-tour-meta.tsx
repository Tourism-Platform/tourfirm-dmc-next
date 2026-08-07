"use client";

import { type FC } from "react";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewTourData } from "@/entities/tour";

import { getLanguageLabel } from "../../model";
import { META_INFO } from "../../model";

interface IPreviewTourMetaProps {
	data?: IPreviewTourData;
}

const PreviewTourMetaBase: FC<IPreviewTourMetaProps> = ({ data }) => {
	const { preview } = useUiContent();

	if (!data) return null;

	const citiesStr = data.cities?.join(", ") || "";
	const languagesStr =
		data.languages
			?.map((lang) => getLanguageLabel(preview.labels.languages, lang))
			.join(", ") || "";

	const metaData = META_INFO(
		citiesStr,
		languagesStr,
		preview.tour.sections.cities.label,
		preview.tour.sections.languages.label
	);

	if (metaData.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-sm">
			{metaData.map((item) => (
				<div key={item.label} className="flex items-center gap-2">
					<item.icon className="text-muted-foreground size-5 shrink-0" />
					<span className="font-medium">{item.label}:</span>
					<span className="text-muted-foreground">{item.value}</span>
				</div>
			))}
		</div>
	);
};

export const PreviewTourMeta = withErrorBoundary(PreviewTourMetaBase);
