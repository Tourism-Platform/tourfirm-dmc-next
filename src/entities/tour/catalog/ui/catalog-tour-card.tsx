"use client";

import { GalleryIcon, Routing2Icon } from "@solar-icons/react/outline";
import { type FC } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { useImageStatus } from "@/shared/hooks";
import { Link, useRouter } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	PreviewerSimple,
	Skeleton
} from "@/shared/ui";
import { formatUiText, useUiContent } from "@/shared/ui-content";
import { formatMoney } from "@/shared/utils";

import { buildCatalogTourCardMeta, getCatalogTourCardMetaIcon } from "../lib";
import { ENUM_CATALOG_TOUR_TYPES } from "../types";
import type { ICatalogTourCard } from "../types";

const VISIBLE_CATEGORIES = 2;
const VISIBLE_LANGUAGES = 5;

type TCatalogTourCardProps = {
	data: ICatalogTourCard;
	className?: string;
};

export const CatalogTourCard: FC<TCatalogTourCardProps> = ({
	data: tour,
	className
}) => {
	const router = useRouter();
	const { tours } = useUiContent();
	const card = tours.card;
	const { isLoaded, isLoading, isError, onLoad, onError } = useImageStatus(
		tour.imageUrl
	);

	const tourHref = tour.slug
		? buildRoute(ENUM_PATH.TOURS.TOUR, { slug: tour.slug })
		: undefined;
	const bookingHref = tour.slug
		? buildRoute(ENUM_PATH.TOURS.BOOKING, { slug: tour.slug })
		: undefined;

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
				"relative flex h-full min-w-0 flex-col gap-0 overflow-hidden pt-0 pb-0 transition-shadow hover:shadow-md",
				className
			)}
		>
			<Link
				href={tourHref ?? "#"}
				aria-disabled={!tourHref}
				className={cn(
					"flex min-w-0 flex-1 flex-col",
					!tourHref && "pointer-events-none"
				)}
			>
				<div className="relative h-36 w-full shrink-0 overflow-hidden bg-muted sm:h-48">
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
					<div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/55 to-transparent sm:h-20" />
					<div className="absolute top-2 left-2 z-10 sm:top-3 sm:left-3">
						<Badge className="border-0 bg-background/95 text-xs text-foreground shadow-sm backdrop-blur-sm sm:text-sm">
							{typeLabel}
						</Badge>
					</div>
					{!!tour.languages.length && (
						<div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1">
							{visibleLanguages.map((lang) => (
								<Badge
									key={lang}
									variant="secondary"
									className="bg-background/95 text-foreground shadow-sm backdrop-blur-sm"
								>
									{lang}
								</Badge>
							))}
							{hiddenLanguagesCount > 0 && (
								<Badge
									variant="secondary"
									className="bg-background/95 text-foreground shadow-sm backdrop-blur-sm"
								>
									+{hiddenLanguagesCount}
								</Badge>
							)}
						</div>
					)}
				</div>

				<CardHeader className="grid gap-2 pt-3 pb-2 sm:gap-2.5 sm:pt-4 sm:pb-3">
					<CardTitle className="line-clamp-2 text-base leading-snug sm:text-lg">
						{tour.title}
					</CardTitle>

					{!!tour.route.length && (
						<div className="text-muted-foreground flex min-w-0 items-start gap-1.5 text-[11px] sm:text-xs">
							<Routing2Icon className="mt-0.5 size-3 shrink-0 sm:size-3.5" />
							<span className="line-clamp-2">
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
									className="text-[11px] sm:text-xs"
								>
									{category.replaceAll("_", " ")}
								</Badge>
							))}
							{hiddenCategoriesCount > 0 && (
								<Badge
									variant="outline"
									className="text-[11px] sm:text-xs"
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
							className="text-muted-foreground text-xs sm:text-sm"
						/>
					)}
				</CardHeader>

				<CardContent className="mt-auto grid gap-2.5 px-4 sm:gap-3 sm:px-6">
					<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
						{metaItems.map((item) => (
							<div
								key={item.key}
								className="bg-accent text-muted-foreground flex min-w-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-xs"
							>
								{getCatalogTourCardMetaIcon(item.key, {
									size: 14,
									className: "size-3.5 shrink-0"
								})}
								<span className="truncate">{item.label}</span>
							</div>
						))}
					</div>

					<div className="flex min-w-0 items-baseline justify-end gap-2 border-t pt-2.5 sm:pt-3">
						<span className="text-primary truncate text-right text-sm font-semibold sm:text-base">
							{formatUiText(card.priceFrom, {
								price: priceLabel
							})}
						</span>
					</div>
				</CardContent>
			</Link>

			<div className="px-4 pt-1 pb-3 sm:px-6 sm:pb-4">
				<Button
					type="button"
					size="sm"
					className="w-full sm:h-10 sm:text-sm"
					disabled={!bookingHref}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						if (!bookingHref) return;
						router.push(bookingHref);
					}}
				>
					{card.bookNow}
				</Button>
			</div>
		</Card>
	);
};
