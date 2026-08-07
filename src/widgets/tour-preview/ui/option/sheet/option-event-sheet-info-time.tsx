"use client";

import { type FC } from "react";

import { useUiContent } from "@/shared/ui-content";

import { SheetInfoCard } from "./sheet-info-card";

interface IOptionEventSheetInfoTimeProps {
	startTime: string;
	endTime: string;
}

export const OptionEventSheetInfoTime: FC<IOptionEventSheetInfoTimeProps> = ({
	startTime,
	endTime
}) => {
	const { preview } = useUiContent();
	const texts = preview.option.sheet;

	if (!startTime && !endTime) {
		return null;
	}

	return (
		<div>
			<h4 className="mb-3 font-semibold">{texts.infoTime}</h4>
			<SheetInfoCard>
				<div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
					<div>
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.startTime}
						</span>
						<p className="mt-1 font-medium">{startTime || "—"}</p>
					</div>
					<span className="text-primary pb-0.5 text-xs">
						{texts.to}
					</span>
					<div className="text-right">
						<span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
							{texts.endTime}
						</span>
						<p className="mt-1 font-medium">{endTime || "—"}</p>
					</div>
				</div>
			</SheetInfoCard>
		</div>
	);
};
