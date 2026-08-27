"use client";

import { GalleryIcon } from "@solar-icons/react/outline";
import { ArrowRight } from "lucide-react";
import { type FC } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useImageStatus } from "@/shared/hooks";
import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
	Button,
	Card,
	CardContent,
	Previewer,
	Skeleton,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import type { IPreviewOptionCard } from "@/entities/tour/preview-tour";

type TPreviewOptionCardProps = {
	tourId: string;
	option: IPreviewOptionCard;
};

const PreviewOptionCardBase: FC<TPreviewOptionCardProps> = ({
	tourId,
	option
}) => {
	const { preview } = useUiContent();
	const cardTexts = preview.tour.sections.itinerary.card;
	const href = buildRoute(ENUM_PATH.TOURS.TOUR_OPTION, {
		tourId,
		optionId: option.id
	});
	const { isLoaded, isLoading, isError, onLoad, onError } = useImageStatus(
		option.image
	);

	return (
		<Card className="overflow-hidden py-0">
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
					<div className="flex min-w-0 flex-col gap-1.5">
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

					<div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t pt-3">
						<div>
							<p className="text-muted-foreground mb-1 text-xs tracking-wider uppercase">
								{cardTexts.from}
							</p>
							<p className="text-xl font-bold">
								{option.price}{" "}
								<span className="text-base font-normal">
									{cardTexts.perPerson}
								</span>
							</p>
							<p className="text-muted-foreground mt-1 text-xs">
								{cardTexts.priceDepends}
							</p>
						</div>

						<Button asChild className="shrink-0">
							<Link href={href}>
								{cardTexts.bookPackage}
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const PreviewOptionCard = withErrorBoundary(PreviewOptionCardBase);
