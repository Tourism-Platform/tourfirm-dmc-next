"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { type TSearchTours, createSearchToursSchema } from "@/entities/tour";

import { HeroSection } from "./hero-section";
import { ToursBlocks } from "./tours-blocks";

// import { RecentlySearch } from "./recently-search";

type TToursProps = {
	sections: TBlockRenderProps[];
};

const ToursBase: FC<TToursProps> = ({ sections }) => {
	const { tours } = useUiContent();
	const schema = useMemo(
		() => createSearchToursSchema(tours.search.where.required),
		[tours.search.where.required]
	);

	const searchForm = useForm<TSearchTours>({
		resolver: zodResolver(schema),
		defaultValues: {
			destination: null,
			dates: undefined
		}
	});

	return (
		<div className="flex flex-col">
			<HeroSection form={searchForm} />
			<div className="flex w-full flex-col gap-12 pt-28 sm:gap-14 sm:pt-32 lg:gap-16">
				{/* <RecentlySearch form={searchForm} /> */}
				<ToursBlocks sections={sections} />
			</div>
		</div>
	);
};

export const Tours = withErrorBoundary(ToursBase);
