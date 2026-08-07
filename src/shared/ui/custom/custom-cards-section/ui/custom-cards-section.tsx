import { cn } from "@/shared/lib/utils";
import { CardRender } from "@/shared/ui/cards/ui/card-render";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/shared/ui/shadcn-ui/carousel";

import { CustomSectionHeader } from "../../custom-section-header";
import type { TCardsSectionProps } from "../model/types/custom-cards-section.types";

import { ContentRows } from "./content-rows";

const CAROUSEL_ITEM_CLASS =
	"basis-[83%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-[40%] lg:basis-[31%]";

export function CardsSection({
	eyebrow,
	title,
	description,
	cards,
	rows,
	gridClassName,
	displayMode = "grid",
	actions,
	emptyLabel
}: TCardsSectionProps) {
	const isCarousel = displayMode === "carousel";
	const hasHeader =
		eyebrow || title || description || (!isCarousel && actions);
	const hasRows = Boolean(rows?.length);
	const hasCards = cards.length > 0;

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			{hasHeader && (
				<CustomSectionHeader
					eyebrow={eyebrow}
					title={title!}
					description={description}
					actions={isCarousel ? undefined : actions}
				/>
			)}
			{hasRows ? (
				<ContentRows rows={rows!} />
			) : hasCards && isCarousel ? (
				<Carousel opts={{ align: "start" }} className="w-full">
					<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
						{cards.map((card, index) => (
							<CarouselItem
								key={card.key ?? String(index)}
								className={CAROUSEL_ITEM_CLASS}
							>
								<CardRender type={card.type} item={card.item} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			) : hasCards ? (
				<div
					className={cn(
						"grid grid-cols-1 gap-4",
						gridClassName ?? "md:grid-cols-3"
					)}
				>
					{cards.map((card, index) => (
						<CardRender
							key={card.key ?? String(index)}
							type={card.type}
							item={card.item}
						/>
					))}
				</div>
			) : emptyLabel ? (
				<p className="text-muted-foreground text-sm">{emptyLabel}</p>
			) : null}
			{isCarousel && actions ? (
				<div className="flex justify-center">{actions}</div>
			) : null}
		</section>
	);
}
