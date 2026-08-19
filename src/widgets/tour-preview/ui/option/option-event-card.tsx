"use client";

import { type FC } from "react";

import { cn } from "@/shared/lib";
import { Previewer, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IOptionEvent } from "@/entities/tour/preview-tour";

import { OptionEventDetailSheet } from "./option-event-detail-sheet";
import { getOptionEventIcon } from "./option-event-icons";

interface IOptionEventCardProps {
	event: IOptionEvent;
	index: number;
}

const OptionEventCardBase: FC<IOptionEventCardProps> = ({ event, index }) => {
	const { preview } = useUiContent();
	const optionTexts = preview.option.sections.option;
	const sheetTexts = preview.option.sheet;

	const isMultiply = Boolean(event.sub_options?.length);
	const isReversed = index % 2 !== 0;
	const cardImage = event.sheet.images[0];
	const infoTimes =
		event.sheet.extra.kind === "info" ? event.sheet.extra : null;
	const hasInfoTimes = Boolean(
		infoTimes && (infoTimes.startTime || infoTimes.endTime)
	);

	return (
		<div className="bg-card grid grid-cols-2 gap-0 overflow-hidden rounded-xl border shadow-sm">
			<div
				className={cn(
					"flex flex-col gap-4 p-6",
					isReversed ? "order-2" : "order-1"
				)}
			>
				<div className="flex items-center gap-3">
					<div className="bg-accent flex size-8 shrink-0 items-center justify-center rounded-full">
						{getOptionEventIcon(event.type)}
					</div>
					<h4 className="font-semibold">
						{event.title}
						{isMultiply && ` ${optionTexts.oneOfThem}`}
					</h4>
				</div>

				{hasInfoTimes && infoTimes && (
					<div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end text-sm">
						<div>
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{sheetTexts.startTime}
							</span>
							<p className="font-medium mt-1">
								{infoTimes.startTime || "—"}
							</p>
						</div>
						<span className="text-xs text-primary pb-0.5">
							{sheetTexts.to}
						</span>
						<div className="text-right">
							<span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
								{sheetTexts.endTime}
							</span>
							<p className="font-medium mt-1">
								{infoTimes.endTime || "—"}
							</p>
						</div>
					</div>
				)}

				<Previewer
					text={event.description}
					className={cn(
						"text-muted-foreground text-sm leading-relaxed",
						!isMultiply && "line-clamp-6"
					)}
				/>

				{isMultiply ? (
					<div className="flex flex-col gap-3">
						{event.sub_options?.map((subOption) => (
							<div
								key={subOption.id}
								className="flex flex-col gap-2 rounded-lg border p-4"
							>
								<h5 className="text-sm font-semibold">
									{subOption.title}
								</h5>
								<Previewer
									text={subOption.description}
									className="text-muted-foreground line-clamp-3 text-xs leading-relaxed"
								/>
								<OptionEventDetailSheet
									source={subOption}
									variant="xs"
								/>
							</div>
						))}
					</div>
				) : (
					<OptionEventDetailSheet source={event} />
				)}
			</div>

			<div
				className={cn(
					"relative aspect-[4/3] overflow-hidden",
					isReversed ? "order-1" : "order-2",
					!cardImage?.imagePath && "bg-muted"
				)}
			>
				{cardImage?.imagePath ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={cardImage.imagePath}
						alt={event.title}
						className="absolute inset-0 h-full w-full object-cover"
					/>
				) : (
					<div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
						{getOptionEventIcon(event.type, "lg")}
					</div>
				)}
			</div>
		</div>
	);
};

export const OptionEventCard = withErrorBoundary(OptionEventCardBase);
