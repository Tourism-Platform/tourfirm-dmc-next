"use client";

import { useTranslations } from "next-intl";
import { type FC, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";

import {
	RecentSearchCard,
	RecentSearchCardSkeleton,
	type TSearchTours,
	useGetRecentlySearchedToursQuery
} from "@/entities/tour";

interface IRecentlySearchProps {
	form: UseFormReturn<TSearchTours>;
}

const RecentlySearchBase: FC<IRecentlySearchProps> = ({ form }) => {
	const t = useTranslations("catalog_page");
	const { data: items = [], isLoading } = useGetRecentlySearchedToursQuery();

	const handleSelect = useCallback(
		(searchTours: TSearchTours) => {
			form.reset(searchTours);
		},
		[form]
	);

	if (!isLoading && items.length === 0) return null;

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold sm:text-2xl">
				{t("recent.title")}
			</h2>
			<div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible">
				{isLoading
					? Array.from({ length: 4 }).map((_, index) => (
							<RecentSearchCardSkeleton key={index} />
						))
					: items.map((item) => (
							<div key={item.id} className="snap-start lg:w-auto">
								<RecentSearchCard
									data={item}
									onClick={() =>
										handleSelect(item.searchTours)
									}
								/>
							</div>
						))}
			</div>
		</section>
	);
};

export const RecentlySearch = withErrorBoundary(RecentlySearchBase);
