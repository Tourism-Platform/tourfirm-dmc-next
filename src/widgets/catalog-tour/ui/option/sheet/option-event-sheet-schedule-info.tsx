"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetScheduleInfoProps {
	nights: string;
	checkIn: string;
	checkOut: string;
}

export const OptionEventSheetScheduleInfo: FC<
	IOptionEventSheetScheduleInfoProps
> = ({ nights, checkIn, checkOut }) => {
	const t = useTranslations("catalog_tour_option_page");

	return (
		<div>
			<h4 className="font-semibold mb-3">{t("sheet.schedule_info")}</h4>
			<SheetInfoCard>
				<div className="flex flex-col gap-4">
					<div>
						<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
							{t("sheet.nights")}
						</span>
						<p className="font-medium mt-1">{nights}</p>
					</div>
					<div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
						<div>
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{t("sheet.check_in")}
							</span>
							<p className="font-medium mt-1">{checkIn}</p>
						</div>
						<span className="text-xs text-primary pb-0.5">
							{t("sheet.to")}
						</span>
						<div className="text-right">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{t("sheet.check_out")}
							</span>
							<p className="font-medium mt-1">{checkOut}</p>
						</div>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
