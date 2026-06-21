"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import type { IOptionEventSheetPoint } from "@/entities/tour/catalog";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetPickupInfoProps {
	pickup: IOptionEventSheetPoint;
	dropoff: IOptionEventSheetPoint;
}

export const OptionEventSheetPickupInfo: FC<
	IOptionEventSheetPickupInfoProps
> = ({ pickup, dropoff }) => {
	const t = useTranslations("catalog_tour_option_page");

	return (
		<div>
			<h4 className="font-semibold mb-3">{t("sheet.pickup_info")}</h4>
			<SheetInfoCard>
				<div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
					<div className="flex flex-col gap-1">
						<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
							{t("sheet.pickup")}
						</span>
						<span className="font-medium text-foreground">
							{pickup.place}
						</span>
						<span className="text-xs text-muted-foreground">
							{pickup.dateTime}
						</span>
					</div>
					<span className="text-xs text-primary self-center pt-4">
						{t("sheet.to")}
					</span>
					<div className="flex flex-col gap-1 text-right">
						<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
							{t("sheet.dropoff")}
						</span>
						<span className="font-medium text-foreground">
							{dropoff.place}
						</span>
						<span className="text-xs text-muted-foreground">
							{dropoff.dateTime}
						</span>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
