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

import {
	CatalogTourCard,
	CatalogTourCardSkeleton,
	useGetPopularToursQuery
} from "@/entities/tour";

type TMostPopularToursProps = {
	eyebrow?: string;
	title: string;
	description?: string;
};

const MostPopularToursBase: FC<TMostPopularToursProps> = ({
	eyebrow,
	title,
	description
}) => {
	const { tours: toursUi } = useUiContent();
	const { data, isLoading, isError } = useGetPopularToursQuery();
	const tours = data?.data ?? [];

	useEffect(() => {
		if (isError) toast.error(toursUi.toasts.loadError);
	}, [isError, toursUi.toasts.loadError]);

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<div className="space-y-2">
				{eyebrow ? (
					<p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
						{eyebrow}
					</p>
				) : null}
				<h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
				{description ? (
					<p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
						{description}
					</p>
				) : null}
			</div>
			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
					{isLoading
						? Array.from({ length: 4 }).map((_, index) => (
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

export const MostPopularTours = withErrorBoundary(MostPopularToursBase);
