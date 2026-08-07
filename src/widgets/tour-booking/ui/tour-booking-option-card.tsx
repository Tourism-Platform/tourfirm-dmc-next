"use client";

import { type FC } from "react";

import { cn } from "@/shared/lib";
import { useUiContent } from "@/shared/ui-content";
import { withErrorBoundary } from "@/shared/ui/error-boundary";
import { Badge } from "@/shared/ui/shadcn-ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle
} from "@/shared/ui/shadcn-ui/card";

import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

interface ITourBookingOptionCardProps {
	option: IPreviewOptionCard;
	isSelected: boolean;
	onSelect: (optionId: string) => void;
	disabled?: boolean;
}

export const TourBookingOptionCardBase: FC<ITourBookingOptionCardProps> = ({
	option,
	isSelected,
	onSelect,
	disabled = false
}) => {
	const { preview } = useUiContent();
	const card = preview.tour.sections.itinerary.card;

	return (
		<Card
			className={cn(
				"transition-colors",
				disabled && "cursor-default opacity-60",
				!disabled && "cursor-pointer",
				isSelected
					? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
					: !disabled && "hover:bg-muted/50"
			)}
			onClick={() => !disabled && onSelect(option.id)}
		>
			<CardContent>
				<div className="flex flex-col gap-6 lg:flex-row">
					<div className="flex flex-1 flex-col gap-4">
						<div className="grid gap-3">
							<div className="flex items-start justify-between gap-3">
								<Badge>
									<CardTitle>{option.title}</CardTitle>
								</Badge>
								<div
									className={cn(
										"mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border",
										isSelected
											? "border-primary bg-primary"
											: "border-input"
									)}
								>
									{isSelected && (
										<span className="size-2 rounded-full bg-primary-foreground" />
									)}
								</div>
							</div>
							<CardDescription>
								{option.description}
							</CardDescription>
						</div>

						<div className="mt-auto">
							<p className="mb-1 text-xs tracking-wider text-muted-foreground uppercase">
								{card.from}
							</p>
							<p className="text-xl font-bold">
								{option.price}{" "}
								<span className="text-base font-normal">
									{card.perPerson}
								</span>
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{card.priceDepends}
							</p>
						</div>
					</div>

					<div className="w-full shrink-0 lg:w-[320px]">
						<img
							src={option.image}
							alt={option.title}
							className="h-[240px] w-full rounded-xl object-cover"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const TourBookingOptionCard = withErrorBoundary(
	TourBookingOptionCardBase
);
