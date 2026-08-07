"use client";

import { type FC } from "react";

import { Previewer } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

interface IOptionEventSheetDetailsProps {
	description: string;
}

export const OptionEventSheetDetails: FC<IOptionEventSheetDetailsProps> = ({
	description
}) => {
	const { preview } = useUiContent();

	return (
		<div>
			<h4 className="mb-3 font-semibold">
				{preview.option.sections.option.details}
			</h4>
			<Previewer
				text={description}
				className="text-muted-foreground text-sm leading-relaxed"
			/>
		</div>
	);
};
