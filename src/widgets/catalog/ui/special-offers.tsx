"use client";

import { useTranslations } from "next-intl";
import { type FC, useEffect } from "react";
import { toast } from "sonner";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import {
	Button,
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
	useGetSpecialOfferToursQuery
} from "@/entities/tour";

const SpecialOffersBase: FC = () => {
	const t = useTranslations("catalog_page");
	const { data, isLoading, isError } = useGetSpecialOfferToursQuery();
	const tours = data?.data ?? [];

	useEffect(() => {
		if (isError) toast.error(t("toasts.load_error"));
	}, [isError, t]);

	return (
		<section className="overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-secondary to-muted p-6 sm:p-10">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_2fr]">
				<div className="flex flex-col gap-4">
					<h2 className="text-destructive text-2xl font-bold uppercase sm:text-3xl">
						{t("offers.title")}
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base">
						{t("offers.subtitle")}
					</p>
					<Button asChild variant="destructive" className="w-fit">
						<Link href={ENUM_PATH.MAIN.CATALOG}>
							{t("offers.cta")}
						</Link>
					</Button>
				</div>
				<Carousel opts={{ align: "start" }} className="w-full">
					<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
						{isLoading
							? Array.from({ length: 3 }).map((_, index) => (
									<CarouselItem
										key={`skeleton-${index}`}
										className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/3"
									>
										<CatalogTourCardSkeleton />
									</CarouselItem>
								))
							: tours.map((tour) => (
									<CarouselItem
										key={tour.id}
										className="basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/3"
									>
										<CatalogTourCard data={tour} />
									</CarouselItem>
								))}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			</div>
		</section>
	);
};

export const SpecialOffers = withErrorBoundary(SpecialOffersBase);
