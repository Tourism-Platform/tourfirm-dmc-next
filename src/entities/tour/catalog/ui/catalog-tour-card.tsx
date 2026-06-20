"use client";

import { Check, Clock4, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC, ReactNode } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { Badge, Card, CardContent, CardFooter, Separator } from "@/shared/ui";
import { formatToDollars } from "@/shared/utils";

import type { ICatalogTourCard } from "../types";

interface ICatalogTourCardProps {
	data: ICatalogTourCard;
	className?: string;
	action?: ReactNode;
}

export const CatalogTourCard: FC<ICatalogTourCardProps> = ({
	data: tour,
	className,
	action
}) => {
	const t = useTranslations("catalog_page");

	return (
		<div className={cn("block h-full", className)}>
			<Card className="flex h-full flex-col gap-0 overflow-hidden pt-0 pb-0">
				<Link
					href={ENUM_PATH.MAIN.CATALOG}
					className="block min-h-0 flex-1"
				>
					<div className="relative h-44 w-full shrink-0 sm:h-48">
						<Image
							src={tour.imageUrl}
							alt={tour.title}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 100vw, 25vw"
						/>
						{tour.isRecommended && (
							<Badge className="absolute top-3 right-3">
								{t("card.recommended")}
							</Badge>
						)}
					</div>
					<CardContent className="grid gap-4 py-4">
						<h3 className="line-clamp-1 text-base font-semibold sm:text-lg">
							{tour.title}
						</h3>
						<div className="flex items-center gap-1">
							{Array.from({ length: 5 }).map((_, index) => (
								<Star
									key={index}
									className={cn(
										"size-4",
										index < tour.rating
											? "fill-primary text-primary"
											: "text-muted-foreground/40"
									)}
								/>
							))}
							<span className="text-muted-foreground ml-1 text-xs">
								{t("card.reviews", {
									count: tour.reviewsCount
								})}
							</span>
						</div>
						<Separator />
						<p className="text-muted-foreground line-clamp-2 text-sm">
							{tour.description}
						</p>
						<div className="mt-auto flex items-center justify-between gap-2">
							<div className="flex flex-col gap-1">
								<div className="text-muted-foreground flex items-center gap-1 text-xs">
									<Clock4 className="size-3.5" />
									<span>
										{t("card.duration_days", {
											count: tour.duration
										})}
									</span>
								</div>
								{tour.hasFreeCancellation && (
									<div className="text-muted-foreground flex items-center gap-1 text-xs">
										<Check className="size-3.5" />
										<span>
											{t("card.free_cancellation")}
										</span>
									</div>
								)}
							</div>
							<span className="text-primary text-base font-semibold whitespace-nowrap sm:text-lg">
								{t("card.price_from", {
									price: formatToDollars(tour.priceFrom)
								})}
							</span>
						</div>
					</CardContent>
				</Link>
				{action && (
					<CardFooter className="flex-col items-stretch border-t pt-3 pb-4">
						{action}
					</CardFooter>
				)}
			</Card>
		</div>
	);
};
