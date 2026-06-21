"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

interface IOptionEventSheetDetailsProps {
	description: string;
}

export const OptionEventSheetDetails: FC<IOptionEventSheetDetailsProps> = ({
	description
}) => {
	const t = useTranslations("catalog_tour_option_page");

	return (
		<div>
			<h4 className="font-semibold mb-3">
				{t("sections.option.details")}
			</h4>
			<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
				{description}
			</p>
		</div>
	);
};
