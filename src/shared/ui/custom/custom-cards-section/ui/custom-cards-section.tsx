import { Fragment } from "react";

import { cn } from "@/shared/lib/utils";
import { ToneBand } from "@/shared/ui/blocks";
import { CardRender } from "@/shared/ui/cards/ui/card-render";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from "@/shared/ui/shadcn-ui/carousel";

import { CustomSectionHeader } from "../../custom-section-header";
import { TagList } from "../../custom-tag-list";
import type { TCardsSectionProps } from "../model/types/custom-cards-section.types";

import { ContentRows } from "./content-rows";

const CAROUSEL_ITEM_CLASS =
	"basis-[83%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-[40%] lg:basis-[31%]";

const MOSAIC_SPAN_CLASS: Record<string, string> = {
	default: "",
	wide: "col-span-2",
	large: "col-span-2 row-span-2"
};

const GRID_SPAN_CLASS: Record<string, string> = {
	default: "",
	wide: "sm:col-span-2",
	large: "sm:col-span-2 lg:row-span-2"
};

export function CardsSection({
	eyebrow,
	title,
	description,
	cards,
	rows,
	gridClassName,
	displayMode = "grid",
	tone,
	tags,
	actions,
	emptyLabel
}: TCardsSectionProps) {
	const isCarousel = displayMode === "carousel";
	const isMosaic = displayMode === "mosaic";
	const hasHeader =
		eyebrow || title || description || (!isCarousel && actions);
	const hasRows = Boolean(rows?.length);
	const hasCards = cards.length > 0;

	return (
		<ToneBand tone={tone}>
			<section className="flex flex-col gap-6 sm:gap-8">
				{hasHeader && (
					<CustomSectionHeader
						eyebrow={eyebrow}
						title={title!}
						description={description}
						actions={isCarousel ? undefined : actions}
					/>
				)}
				<TagList tags={tags} className="flex flex-wrap gap-2" />
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
									<CardRender
										type={card.type}
										item={card.item}
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="hidden sm:flex" />
						<CarouselNext className="hidden sm:flex" />
					</Carousel>
				) : hasCards && isMosaic ? (
					<div className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 lg:auto-rows-[11rem] lg:grid-cols-4">
						{cards.map((card, index) => (
							<div
								key={card.key ?? String(index)}
								className={cn(
									MOSAIC_SPAN_CLASS[
										card.item.span ?? "default"
									]
								)}
							>
								<CardRender type={card.type} item={card.item} />
							</div>
						))}
					</div>
				) : hasCards ? (
					<div
						className={cn(
							"grid grid-cols-1 gap-6 sm:gap-8",
							gridClassName ?? "md:grid-cols-3"
						)}
					>
						{cards.map((card, index) => {
							const key = card.key ?? String(index);
							const span = card.item.span ?? "default";
							const node = (
								<CardRender type={card.type} item={card.item} />
							);

							if (span === "default") {
								return <Fragment key={key}>{node}</Fragment>;
							}

							return (
								<div
									key={key}
									className={GRID_SPAN_CLASS[span]}
								>
									{node}
								</div>
							);
						})}
					</div>
				) : emptyLabel ? (
					<p className="text-muted-foreground text-sm">
						{emptyLabel}
					</p>
				) : null}
				{isCarousel && actions ? (
					<div className="flex justify-center">{actions}</div>
				) : null}
			</section>
		</ToneBand>
	);
}
