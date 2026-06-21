"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC, useMemo } from "react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
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
	type ICatalogTourFilters,
	useGetCatalogToursQuery
} from "@/entities/tour";

interface ISearchSimilarProps {
	params: ICatalogTourFilters;
}

const SearchSimilarBase: FC<ISearchSimilarProps> = ({ params }) => {
	const t = useTranslations("search_page");

	const similarParams = useMemo(
		() => ({
			...params,
			page: 1,
			limit: 6,
			checkIn: undefined,
			checkOut: undefined
		}),
		[params]
	);

	const {
		data: toursData,
		isLoading,
		isFetching
	} = useGetCatalogToursQuery(similarParams);

	const tours = useMemo(() => toursData?.data ?? [], [toursData]);

	if (!isLoading && !isFetching && tours.length === 0) {
		return null;
	}

	return (
		<div className="grid gap-8">
			<Alert variant="warning" appearance="light" className="px-6 py-5">
				<AlertIcon>
					<Sparkles className="size-5" />
				</AlertIcon>
				<AlertContent className="flex flex-col gap-1 sm:flex-row sm:gap-2">
					<AlertTitle className="mb-0">{t("alert.title")}</AlertTitle>
					<AlertDescription>
						{t("alert.description")}
					</AlertDescription>
				</AlertContent>
			</Alert>

			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="-ml-4 pb-2">
					{isLoading || isFetching
						? Array.from({ length: 3 }).map((_, index) => (
								<CarouselItem
									key={`skeleton-${index}`}
									className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
								>
									<CatalogTourCardSkeleton />
								</CarouselItem>
							))
						: tours.map((tour) => (
								<CarouselItem
									key={tour.id}
									className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
								>
									<CatalogTourCard data={tour} />
								</CarouselItem>
							))}
				</CarouselContent>
				<CarouselPrevious className="hidden sm:flex" />
				<CarouselNext className="hidden sm:flex" />
			</Carousel>
		</div>
	);
};

export const SearchSimilar = withErrorBoundary(SearchSimilarBase);
