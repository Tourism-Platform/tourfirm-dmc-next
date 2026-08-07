"use client";

import { type FC } from "react";

import { useUiContent } from "@/shared/ui-content";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetActivityInfoProps {
	location: string;
	startTime: string;
	endTime: string;
}

export const OptionEventSheetActivityInfo: FC<
	IOptionEventSheetActivityInfoProps
> = ({ location, startTime, endTime }) => {
	const { preview } = useUiContent();
	const texts = preview.option.sheet;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{texts.activityInfo}</h4>
			<SheetInfoCard>
				<div className="flex flex-col gap-4">
					<div>
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.location}
						</span>
						<p className="mt-1 font-medium">{location}</p>
					</div>
					<div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
						<div>
							<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
								{texts.startTime}
							</span>
							<p className="mt-1 font-medium">{startTime}</p>
						</div>
						<span className="text-primary pb-0.5 text-xs">
							{texts.to}
						</span>
						<div className="text-right">
							<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
								{texts.endTime}
							</span>
							<p className="mt-1 font-medium">{endTime}</p>
						</div>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
