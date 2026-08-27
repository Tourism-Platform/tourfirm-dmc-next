"use client";

import { GalleryIcon, Routing2Icon } from "@solar-icons/react/outline";
import { type FC } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useImageStatus } from "@/shared/hooks";
import { Link, useRouter } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { Badge, Button, Card, PreviewerSimple, Skeleton } from "@/shared/ui";
import { formatUiText, useUiContent } from "@/shared/ui-content";
import { formatMoney } from "@/shared/utils";

import { buildCatalogTourCardMeta, getCatalogTourCardMetaIcon } from "../lib";
import { ENUM_CATALOG_TOUR_TYPES } from "../types";
import type { ICatalogTourCard } from "../types";

const VISIBLE_CATEGORIES = 2;
const VISIBLE_LANGUAGES = 5;

type TCatalogTourCardHorizontalProps = {
	data: ICatalogTourCard;
	className?: string;
};

export const CatalogTourCardHorizontal: FC<TCatalogTourCardHorizontalProps> = ({
	data: tour,
	className
}) => {
	const router = useRouter();
	const { tours } = useUiContent();
	const card = tours.card;
	const { isLoaded, isLoading, isError, onLoad, onError } = useImageStatus(
		tour.imageUrl
	);

	const tourHref = buildRoute(ENUM_PATH.TOURS.TOUR, { tourId: tour.id });
	const bookingHref = buildRoute(ENUM_PATH.TOURS.BOOKING, {
		tourId: tour.id
	});

	const visibleCategories = tour.categories.slice(0, VISIBLE_CATEGORIES);
	const hiddenCategoriesCount = Math.max(
		tour.categories.length - VISIBLE_CATEGORIES,
		0
	);

	const visibleLanguages = tour.languages.slice(0, VISIBLE_LANGUAGES);
	const hiddenLanguagesCount = Math.max(
		tour.languages.length - VISIBLE_LANGUAGES,
		0
	);

	const metaItems = buildCatalogTourCardMeta(tour, card);

	const priceLabel = formatMoney(tour.priceFrom, {
		currency: tour.currency
	});

	const typeLabel =
		tour.type === ENUM_CATALOG_TOUR_TYPES.PRIVATE
			? tours.recent.tourType.private
			: tours.recent.tourType.group;

	return (
		<Card
			className={cn(
				"relative flex min-w-0 flex-row items-stretch gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md",
				className
			)}
		>
			<div className="relative w-1/2 shrink-0 self-stretch overflow-hidden bg-muted min-h-[10rem] md:w-1/3">
				<Link href={tourHref} className="absolute inset-0 block">
					{!isLoaded && (
						<div className="absolute inset-0 z-0 flex items-center justify-center">
							{isLoading && (
								<Skeleton className="absolute inset-0 size-full" />
							)}
							<GalleryIcon
								className={cn(
									"size-20 text-muted-foreground/40",
									isLoading &&
										"animate-pulse text-muted-foreground/20"
								)}
							/>
						</div>
					)}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					{tour.imageUrl && !isError && (
						<img
							src={tour.imageUrl}
							alt={tour.title}
							onLoad={onLoad}
							onError={onError}
							className={cn(
								"absolute inset-0 size-full object-cover transition-opacity duration-500",
								isLoaded ? "opacity-100" : "opacity-0"
							)}
						/>
					)}
					<div className="absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-black/55 to-transparent" />
				</Link>
				<div className="absolute top-2 left-2 z-10">
					<Badge className="border-0 bg-background/95 text-xs text-foreground shadow-sm backdrop-blur-sm">
						{typeLabel}
					</Badge>
				</div>
				{!!tour.languages.length && (
					<div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1">
						{visibleLanguages.map((lang) => (
							<Badge
								key={lang}
								variant="secondary"
								className="bg-background/95 text-xs text-foreground shadow-sm backdrop-blur-sm"
							>
								{lang}
							</Badge>
						))}
						{hiddenLanguagesCount > 0 && (
							<Badge
								variant="secondary"
								className="bg-background/95 text-xs text-foreground shadow-sm backdrop-blur-sm"
							>
								+{hiddenLanguagesCount}
							</Badge>
						)}
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2 px-3 py-3 sm:gap-2.5 sm:px-4 sm:py-4">
				<Link href={tourHref} className="flex min-w-0 flex-col gap-1.5">
					<span className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
						{tour.title}
					</span>
					{!!tour.route.length && (
						<div className="text-muted-foreground flex min-w-0 items-center gap-1 text-[11px] sm:text-xs">
							<Routing2Icon className="size-3 shrink-0" />
							<span className="truncate">
								{tour.route.join(" → ")}
							</span>
						</div>
					)}
					{!!tour.categories.length && (
						<div className="flex flex-wrap gap-1">
							{visibleCategories.map((category) => (
								<Badge
									key={category}
									variant="outline"
									className="text-[10px] sm:text-xs"
								>
									{category.replaceAll("_", " ")}
								</Badge>
							))}
							{hiddenCategoriesCount > 0 && (
								<Badge
									variant="outline"
									className="text-[10px] sm:text-xs"
								>
									+{hiddenCategoriesCount}
								</Badge>
							)}
						</div>
					)}
					{!!tour.description && (
						<PreviewerSimple
							text={tour.description}
							lines={2}
							className="text-muted-foreground text-[11px] sm:text-xs"
						/>
					)}
				</Link>

				<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
					{metaItems.map((item) => (
						<div
							key={item.key}
							className="bg-accent text-muted-foreground flex min-w-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] sm:text-xs"
						>
							{getCatalogTourCardMetaIcon(item.key, {
								size: 14,
								className: "size-3.5 shrink-0"
							})}
							<span className="truncate">{item.label}</span>
						</div>
					))}
				</div>

				<div className="mt-auto flex flex-col gap-2 border-t pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
					<span className="text-primary text-sm font-semibold sm:text-base">
						{formatUiText(card.priceFrom, {
							price: priceLabel
						})}
					</span>
					<Button
						type="button"
						size="sm"
						className="w-full sm:w-auto sm:min-w-36"
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							router.push(bookingHref);
						}}
					>
						{card.bookNow}
					</Button>
				</div>
			</div>
		</Card>
	);
};

export const CatalogTourCardHorizontalSkeleton: FC = () => (
	<Card className="flex min-h-[10rem] flex-row items-stretch gap-0 overflow-hidden py-0">
		<Skeleton className="min-h-[10rem] w-36 rounded-none sm:w-48 md:w-56" />
		<div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
			<Skeleton className="h-4 w-4/5" />
			<Skeleton className="h-3 w-1/2" />
			<Skeleton className="h-8 w-full" />
			<div className="grid grid-cols-2 gap-1.5">
				<Skeleton className="h-7 w-full" />
				<Skeleton className="h-7 w-full" />
				<Skeleton className="h-7 w-full" />
				<Skeleton className="h-7 w-full" />
			</div>
			<div className="mt-auto flex items-center justify-between gap-3 border-t pt-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-9 w-32" />
			</div>
		</div>
	</Card>
);
