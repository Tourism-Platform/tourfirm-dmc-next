"use client";

import { type FC, useEffect } from "react";
import { toast } from "sonner";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import { ButtonRender } from "@/shared/ui/buttons";
import type { TButtonRenderProps } from "@/shared/ui/buttons/types/button-render.types";

import {
	CatalogTourCard,
	CatalogTourCardSkeleton,
	useGetSpecialOfferToursQuery
} from "@/entities/tour";

type TSpecialOffersProps = {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: TButtonRenderProps[];
};

const SpecialOffersBase: FC<TSpecialOffersProps> = ({
	eyebrow,
	title,
	description,
	actions
}) => {
	const { catalog } = useUiContent();
	const { data, isLoading, isError } = useGetSpecialOfferToursQuery();
	const tours = data?.data ?? [];

	useEffect(() => {
		if (isError) toast.error(catalog.toasts.loadError);
	}, [isError, catalog.toasts.loadError]);

	return (
		<section className="overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-secondary to-muted p-6 sm:p-8 lg:p-10">
			<div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
				<div className="max-w-2xl space-y-2">
					{eyebrow ? (
						<p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
							{eyebrow}
						</p>
					) : null}
					<h2 className="text-destructive text-2xl font-bold uppercase sm:text-3xl">
						{title}
					</h2>
					{description ? (
						<p className="text-muted-foreground text-sm sm:text-base">
							{description}
						</p>
					) : null}
				</div>
				{actions?.length ? (
					<div className="flex flex-wrap gap-2">
						{actions.map((action, index) => (
							<ButtonRender
								key={index}
								type={action.type}
								item={action.item}
							/>
						))}
					</div>
				) : null}
			</div>

			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
					{isLoading
						? Array.from({ length: 3 }).map((_, index) => (
								<CarouselItem
									key={`skeleton-${index}`}
									className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-[31%]"
								>
									<CatalogTourCardSkeleton />
								</CarouselItem>
							))
						: tours.map((tour) => (
								<CarouselItem
									key={tour.id}
									className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-[31%]"
								>
									<CatalogTourCard data={tour} />
								</CarouselItem>
							))}
				</CarouselContent>
				<CarouselPrevious className="hidden sm:flex" />
				<CarouselNext className="hidden sm:flex" />
			</Carousel>
		</section>
	);
};

export const SpecialOffers = withErrorBoundary(SpecialOffersBase);
