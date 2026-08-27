"use client";

import { GalleryIcon } from "@solar-icons/react/outline";
import { type FC } from "react";

import { useImageStatus } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import {
	Card,
	CardContent,
	Previewer,
	Skeleton,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

interface ITourBookingOptionCardProps {
	option: IPreviewOptionCard;
	isSelected: boolean;
	onSelect: (optionId: string) => void;
	disabled?: boolean;
}

const TourBookingOptionCardBase: FC<ITourBookingOptionCardProps> = ({
	option,
	isSelected,
	onSelect,
	disabled = false
}) => {
	const { preview } = useUiContent();
	const card = preview.tour.sections.itinerary.card;
	const { isLoaded, isLoading, isError, onLoad, onError } = useImageStatus(
		option.image
	);

	return (
		<Card
			className={cn(
				"overflow-hidden py-0 transition-colors",
				disabled && "cursor-default opacity-60",
				!disabled && "cursor-pointer",
				isSelected
					? "border-primary bg-primary/5 ring-primary/20 ring-1"
					: !disabled && "hover:bg-muted/50"
			)}
			onClick={() => !disabled && onSelect(option.id)}
		>
			<CardContent className="flex min-w-0 flex-col gap-0 p-0 md:flex-row md:items-stretch">
				<div className="bg-muted relative min-h-36 w-full shrink-0 overflow-hidden md:w-1/3">
					{!isLoaded && (
						<div className="absolute inset-0 z-0 flex items-center justify-center">
							{isLoading && (
								<Skeleton className="absolute inset-0 size-full" />
							)}
							<GalleryIcon
								className={cn(
									"text-muted-foreground/40 size-20",
									isLoading &&
										"text-muted-foreground/20 animate-pulse"
								)}
							/>
						</div>
					)}
					{option.image && !isError ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={option.image}
							alt={option.title}
							onLoad={onLoad}
							onError={onError}
							className={cn(
								"absolute inset-0 size-full object-cover transition-opacity duration-500",
								isLoaded ? "opacity-100" : "opacity-0"
							)}
						/>
					) : null}
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 flex-1 flex-col gap-1.5">
							<span className="line-clamp-2 text-sm leading-snug font-semibold sm:text-base">
								{option.title}
							</span>
							{option.description ? (
								<Previewer
									text={option.description}
									className="text-muted-foreground text-sm leading-relaxed"
								/>
							) : null}
						</div>
						<div
							className={cn(
								"mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border",
								isSelected
									? "border-primary bg-primary"
									: "border-input"
							)}
						>
							{isSelected ? (
								<span className="bg-primary-foreground size-2 rounded-full" />
							) : null}
						</div>
					</div>

					<div className="mt-auto border-t pt-3">
						<p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
							{card.from}
						</p>
						<p className="text-xl font-bold">
							{option.price}{" "}
							<span className="text-base font-normal">
								{card.perPerson}
							</span>
						</p>
						<p className="text-muted-foreground mt-1 text-xs">
							{card.priceDepends}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const TourBookingOptionCard = withErrorBoundary(
	TourBookingOptionCardBase
);
