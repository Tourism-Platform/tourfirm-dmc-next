"use client";

import { useTranslations } from "next-intl";
import { type FC } from "react";

import { cn } from "@/shared/lib";
import { withErrorBoundary } from "@/shared/ui";

import type { IOptionEvent } from "@/entities/tour/catalog";

import { OptionEventDetailSheet } from "./option-event-detail-sheet";
import { getOptionEventIcon } from "./option-event-icons";

interface IOptionEventCardProps {
	event: IOptionEvent;
	index: number;
}

const OptionEventCardBase: FC<IOptionEventCardProps> = ({ event, index }) => {
	const t = useTranslations("catalog_tour_option_page");

	const isMultiply = Boolean(event.sub_options?.length);
	const isReversed = index % 2 !== 0;
	const cardImage = event.sheet.images[0];

	return (
		<div className="grid grid-cols-2 gap-0 bg-card rounded-xl border overflow-hidden shadow-sm">
			<div
				className={cn(
					"flex flex-col gap-4 p-6",
					isReversed ? "order-2" : "order-1"
				)}
			>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
						{getOptionEventIcon(event.type)}
					</div>
					<h4 className="font-semibold">
						{event.title}
						{isMultiply && ` ${t("sections.option.one_of_them")}`}
					</h4>
				</div>

				<p
					className={cn(
						"text-sm text-muted-foreground leading-relaxed",
						!isMultiply && "line-clamp-6"
					)}
				>
					{event.description}
				</p>

				{isMultiply ? (
					<div className="flex flex-col gap-3">
						{event.sub_options?.map((subOption) => (
							<div
								key={subOption.id}
								className="border rounded-lg p-4 flex flex-col gap-2"
							>
								<h5 className="font-semibold text-sm">
									{subOption.title}
								</h5>
								<p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
									{subOption.description}
								</p>
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
					isReversed ? "order-1" : "order-2",
					!cardImage && "bg-muted"
				)}
			>
				{cardImage ? (
					<img
						src={cardImage}
						alt={event.title}
						className="w-full h-full min-h-[240px] object-cover"
					/>
				) : (
					<div className="w-full min-h-[240px] flex items-center justify-center text-muted-foreground">
						{getOptionEventIcon(event.type, "lg")}
					</div>
				)}
			</div>
		</div>
	);
};

export const OptionEventCard = withErrorBoundary(OptionEventCardBase);
