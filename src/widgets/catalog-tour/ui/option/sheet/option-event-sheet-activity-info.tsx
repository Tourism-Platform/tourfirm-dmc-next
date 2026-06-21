"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetActivityInfoProps {
	location: string;
	startTime: string;
	endTime: string;
}

export const OptionEventSheetActivityInfo: FC<
	IOptionEventSheetActivityInfoProps
> = ({ location, startTime, endTime }) => {
	const t = useTranslations("catalog_tour_option_page");

	return (
		<div>
			<h4 className="font-semibold mb-3">{t("sheet.activity_info")}</h4>
			<SheetInfoCard>
				<div className="flex flex-col gap-4">
					<div>
						<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
							{t("sheet.location")}
						</span>
						<p className="font-medium mt-1">{location}</p>
					</div>
					<div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
						<div>
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{t("sheet.start_time")}
							</span>
							<p className="font-medium mt-1">{startTime}</p>
						</div>
						<span className="text-xs text-primary pb-0.5">
							{t("sheet.to")}
						</span>
						<div className="text-right">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{t("sheet.end_time")}
							</span>
							<p className="font-medium mt-1">{endTime}</p>
						</div>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
