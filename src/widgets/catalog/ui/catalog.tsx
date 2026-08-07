"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import type { TBlockRenderProps } from "@/shared/ui/blocks";

import { type TSearchTours, createSearchToursSchema } from "@/entities/tour";

import { CatalogBlocks } from "./catalog-blocks";
import { HeroSection } from "./hero-section";

// import { RecentlySearch } from "./recently-search";

type TCatalogProps = {
	sections: TBlockRenderProps[];
};

const CatalogBase: FC<TCatalogProps> = ({ sections }) => {
	const { catalog } = useUiContent();
	const schema = useMemo(
		() => createSearchToursSchema(catalog.search.where.required),
		[catalog.search.where.required]
	);

	const searchForm = useForm<TSearchTours>({
		resolver: zodResolver(schema),
		defaultValues: {
			destination: "",
			dates: undefined
		}
	});

	return (
		<div className="flex flex-col">
			<HeroSection form={searchForm} />
			<div className="flex w-full flex-col gap-12 py-16 sm:gap-14 sm:pt-20 lg:gap-16">
				{/* <RecentlySearch form={searchForm} /> */}
				<CatalogBlocks sections={sections} />
			</div>
		</div>
	);
};

export const Catalog = withErrorBoundary(CatalogBase);
