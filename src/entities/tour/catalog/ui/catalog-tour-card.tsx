"use client";

import { Image, Layers, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC, type ReactNode, useState } from "react";

import { ENUM_PATH, buildRoute } from "@/shared/config";
import { Link } from "@/shared/i18n";
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

import { ENUM_CATALOG_TOUR_TYPES } from "../types";
import type { ICatalogTourCard } from "../types";

const VISIBLE_CATEGORIES = 2;
const TOUR_PLACEHOLDER = "/assets/images/tours/silk-road.jpg";

type TCatalogTourCardProps = {
	data: ICatalogTourCard;
	className?: string;
};

type TMetaItem = {
	key: string;
	icon: ReactNode;
	label: string;
};

export const CatalogTourCard: FC<TCatalogTourCardProps> = ({
	data: tour,
	className
}) => {
	const router = useRouter();
	const { catalog } = useUiContent();
	const card = catalog.card;
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const tourHref = buildRoute(ENUM_PATH.CATALOG.TOUR, { tourId: tour.id });
	const bookingHref = buildRoute(ENUM_PATH.CATALOG.BOOKING, {
		tourId: tour.id
	});

	const visibleCategories = tour.categories.slice(0, VISIBLE_CATEGORIES);
	const hiddenCategoriesCount = Math.max(
		tour.categories.length - VISIBLE_CATEGORIES,
		0
	);

	const groupLabel =
		tour.groupSizeMin != null && tour.groupSizeMin > 0
			? formatUiText(card.group, {
					min: tour.groupSizeMin,
					max: tour.groupSizeMax
				})
			: String(tour.groupSizeMax);

	const ageLabel =
		tour.ageFrom != null && tour.ageTo != null
			? formatUiText(card.age, {
					from: tour.ageFrom,
					to: tour.ageTo
				})
			: null;

	const metaItems: TMetaItem[] = [
		{
			key: "duration",
			icon: <span className="text-[10px] font-semibold">D</span>,
			label: formatUiText(card.duration, {
				days: tour.days,
				nights: tour.nights
			})
		},
		{
			key: "group",
			icon: <span className="text-[10px] font-semibold">G</span>,
			label: groupLabel
		},
		...(ageLabel
			? [
					{
						key: "age",
						icon: (
							<span className="text-[10px] font-semibold">A</span>
						),
						label: ageLabel
					} satisfies TMetaItem
				]
			: []),
		...(tour.optionCount != null && tour.optionCount > 0
			? [
					{
						key: "options",
						icon: <Layers className="size-3.5 shrink-0" />,
						label: formatUiText(card.options, {
							count: tour.optionCount
						})
					} satisfies TMetaItem
				]
			: [])
	];

	const priceLabel = formatMoney(tour.priceFrom, {
		currency: tour.currency
	});

	const typeLabel =
		tour.type === ENUM_CATALOG_TOUR_TYPES.PRIVATE
			? catalog.recent.tourType.private
			: catalog.recent.tourType.group;

	return (
		<Card
			className={cn(
				"relative flex h-full min-w-0 flex-col gap-0 overflow-hidden pt-0 pb-4 transition-shadow hover:shadow-md",
				className
			)}
		>
			<Link href={tourHref} className="flex min-w-0 flex-1 flex-col">
				<div className="relative h-48 w-full shrink-0 overflow-hidden bg-muted">
					{!isImageLoaded && (
						<div className="absolute inset-0 z-0 flex items-center justify-center">
							<Skeleton className="absolute inset-0 size-full" />
							<Image className="size-10 animate-pulse text-muted-foreground/20" />
						</div>
					)}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={tour.imageUrl || TOUR_PLACEHOLDER}
						alt={tour.title}
						onError={(e) => {
							e.currentTarget.src = TOUR_PLACEHOLDER;
						}}
						onLoad={() => setIsImageLoaded(true)}
						className={cn(
							"absolute inset-0 size-full object-cover transition-opacity duration-500",
							isImageLoaded ? "opacity-100" : "opacity-0"
						)}
					/>
					<div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black/55 to-transparent" />
					<div className="absolute top-3 left-3 z-10">
						<Badge className="border-0 bg-background/95 text-foreground shadow-sm backdrop-blur-sm">
							{typeLabel}
						</Badge>
					</div>
					{!!tour.languages.length && (
						<div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1">
							{tour.languages.map((lang) => (
								<Badge
									key={lang}
									variant="secondary"
									className="bg-background/95 text-foreground shadow-sm backdrop-blur-sm"
								>
									{lang}
								</Badge>
							))}
						</div>
					)}
				</div>

				<CardHeader className="grid gap-2.5 pt-4 pb-3">
					<CardTitle className="line-clamp-2 leading-snug">
						{tour.title}
					</CardTitle>

					{!!tour.route.length && (
						<div className="text-muted-foreground flex min-w-0 items-start gap-1.5 text-xs">
							<MapPin className="mt-0.5 size-3.5 shrink-0" />
							<span className="line-clamp-2">
								{tour.route.join(" → ")}
							</span>
						</div>
					)}

					{!!tour.categories.length && (
						<div className="flex flex-wrap gap-1">
							{visibleCategories.map((category) => (
								<Badge key={category} variant="outline">
									{category.replaceAll("_", " ")}
								</Badge>
							))}
							{hiddenCategoriesCount > 0 && (
								<Badge variant="outline">
									+{hiddenCategoriesCount}
								</Badge>
							)}
						</div>
					)}

					{!!tour.description && (
						<PreviewerSimple
							text={tour.description}
							lines={2}
							className="text-muted-foreground text-sm"
						/>
					)}
				</CardHeader>

				<CardContent className="mt-auto grid gap-3">
					<div className="grid grid-cols-2 gap-2">
						{metaItems.map((item) => (
							<div
								key={item.key}
								className="bg-accent text-muted-foreground flex min-w-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs"
							>
								{item.icon}
								<span className="truncate">{item.label}</span>
							</div>
						))}
					</div>

					<div className="flex min-w-0 items-baseline justify-end gap-2 border-t pt-3">
						<span className="text-primary truncate text-right text-base font-semibold">
							{formatUiText(card.priceFrom, {
								price: priceLabel
							})}
						</span>
					</div>
				</CardContent>
			</Link>

			<div className="px-6 pt-1">
				<Button
					type="button"
					className="w-full"
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						router.push(bookingHref);
					}}
				>
					{card.bookNow}
				</Button>
			</div>
		</Card>
	);
};
