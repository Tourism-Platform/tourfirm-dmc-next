"use client";

import { MoreHorizontal, Plane } from "lucide-react";
import { type FC } from "react";

import { type TUiPreviewOption, useUiContent } from "@/shared/ui-content";

import type { IOptionFlightSegment } from "@/entities/tour/preview-tour";

interface IOptionEventSheetFlightInfoProps {
	segments: IOptionFlightSegment[];
}

const formatFlightPlace = (
	place: string,
	terminal: string | null,
	gate: string | null,
	sheet: TUiPreviewOption["sheet"]
): string =>
	[
		place,
		terminal ? `${sheet.terminal} ${terminal}` : null,
		gate ? `${sheet.gate} ${gate}` : null
	]
		.filter(Boolean)
		.join(" • ");

export const OptionEventSheetFlightInfo: FC<
	IOptionEventSheetFlightInfoProps
> = ({ segments }) => {
	const { preview } = useUiContent();
	const sheet = preview.option.sheet;

	if (!segments.length) return null;

	return (
		<div>
			<h4 className="mb-3 font-semibold">{sheet.flightInfo}</h4>
			<div className="flex flex-col gap-4">
				{segments.map((segment, index) => (
					<div
						key={`${segment.departureCode}-${index}`}
						className="flex flex-col gap-4 rounded-lg border p-4"
					>
						<div className="flex items-start justify-between gap-2">
							<div className="flex min-w-0 items-center gap-2">
								<div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
									<Plane className="text-primary size-4" />
								</div>
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold">
										{segment.route}
									</p>
									<p className="text-muted-foreground text-xs">
										{segment.airlineCode &&
											`${segment.airlineCode}-`}
										{segment.flightNumber}
										{segment.dateRange &&
											` • ${segment.dateRange}`}
									</p>
								</div>
							</div>
							<button
								type="button"
								className="text-muted-foreground shrink-0"
								aria-label={sheet.more}
							>
								<MoreHorizontal className="size-4" />
							</button>
						</div>

						<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
							<div>
								<p className="text-2xl leading-none font-bold">
									{segment.departureCode}
								</p>
								<p className="mt-1 text-sm font-medium">
									{segment.departureTime}
								</p>
								<p className="text-muted-foreground mt-1 text-xs leading-snug">
									{formatFlightPlace(
										segment.departurePlace,
										segment.departureTerminal,
										segment.departureGate,
										sheet
									)}
								</p>
							</div>
							<Plane className="text-muted-foreground mx-1 size-4" />
							<div className="text-right">
								<p className="text-2xl leading-none font-bold">
									{segment.arrivalCode}
								</p>
								<p className="mt-1 text-sm font-medium">
									{segment.arrivalTime}
								</p>
								<p className="text-muted-foreground mt-1 text-xs leading-snug">
									{segment.arrivalPlace}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
