"use client";

import { type FC } from "react";

import { useUiContent } from "@/shared/ui-content";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetScheduleInfoProps {
	nights: string;
	checkIn: string;
	checkOut: string;
}

export const OptionEventSheetScheduleInfo: FC<
	IOptionEventSheetScheduleInfoProps
> = ({ nights, checkIn, checkOut }) => {
	const { preview } = useUiContent();
	const texts = preview.option.sheet;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{texts.scheduleInfo}</h4>
			<SheetInfoCard>
				<div className="flex flex-col gap-4">
					<div>
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.nights}
						</span>
						<p className="mt-1 font-medium">{nights}</p>
					</div>
					<div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
						<div>
							<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
								{texts.checkIn}
							</span>
							<p className="mt-1 font-medium">{checkIn}</p>
						</div>
						<span className="text-primary pb-0.5 text-xs">
							{texts.to}
						</span>
						<div className="text-right">
							<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
								{texts.checkOut}
							</span>
							<p className="mt-1 font-medium">{checkOut}</p>
						</div>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
