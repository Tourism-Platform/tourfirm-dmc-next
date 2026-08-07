"use client";

import { type FC } from "react";

import { useUiContent } from "@/shared/ui-content";

import type { IOptionEventSheetPoint } from "@/entities/tour/preview-tour";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetPickupInfoProps {
	pickup: IOptionEventSheetPoint;
	dropoff: IOptionEventSheetPoint;
}

export const OptionEventSheetPickupInfo: FC<
	IOptionEventSheetPickupInfoProps
> = ({ pickup, dropoff }) => {
	const { preview } = useUiContent();
	const texts = preview.option.sheet;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{texts.pickupInfo}</h4>
			<SheetInfoCard>
				<div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
					<div className="flex flex-col gap-1">
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.pickup}
						</span>
						<span className="text-foreground font-medium">
							{pickup.place}
						</span>
						<span className="text-muted-foreground text-xs">
							{pickup.dateTime}
						</span>
					</div>
					<span className="text-primary self-center pt-4 text-xs">
						{texts.to}
					</span>
					<div className="flex flex-col gap-1 text-right">
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.dropoff}
						</span>
						<span className="text-foreground font-medium">
							{dropoff.place}
						</span>
						<span className="text-muted-foreground text-xs">
							{dropoff.dateTime}
						</span>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
