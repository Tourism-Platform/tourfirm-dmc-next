"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";

import { type TSearchTours, searchToursSchema } from "@/entities/tour";

import { BlogSection } from "./blog-section";
import { HeroSection } from "./hero-section";
import { MostPopularTours } from "./most-popular-tours";
import { RecentlySearch } from "./recently-search";
import { SpecialOffers } from "./special-offers";
import { TopDestinations } from "./top-destinations";

const CatalogBase: FC = () => {
	const searchForm = useForm<TSearchTours>({
		resolver: zodResolver(searchToursSchema),
		defaultValues: {
			destination: "",
			dates: undefined
		}
	});

	return (
		<div className="flex flex-col">
			<HeroSection form={searchForm} />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:pt-20 lg:gap-16 lg:px-8">
				<RecentlySearch form={searchForm} />
				<MostPopularTours />
				<BlogSection />
				<SpecialOffers />
				<TopDestinations />
			</div>
		</div>
	);
};

export const Catalog = withErrorBoundary(CatalogBase);
