"use client";

import { useTranslations } from "next-intl";
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

import {
	CatalogTourCard,
	CatalogTourCardSkeleton,
	useGetPopularToursQuery
} from "@/entities/tour";

const MostPopularToursBase: FC = () => {
	const t = useTranslations("catalog_page");
	const { data, isLoading, isError } = useGetPopularToursQuery();
	const tours = data?.data ?? [];

	useEffect(() => {
		if (isError) toast.error(t("toasts.load_error"));
	}, [isError, t]);

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<h2 className="text-xl font-semibold sm:text-2xl">
				{t("popular.title")}
			</h2>
			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
					{isLoading
						? Array.from({ length: 4 }).map((_, index) => (
								<CarouselItem
									key={`skeleton-${index}`}
									className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/4"
								>
									<CatalogTourCardSkeleton />
								</CarouselItem>
							))
						: tours.map((tour) => (
								<CarouselItem
									key={tour.id}
									className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/4"
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
