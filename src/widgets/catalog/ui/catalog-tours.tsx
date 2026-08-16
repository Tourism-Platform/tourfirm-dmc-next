"use client";

import {
	LayoutGrid,
	SlidersHorizontal,
	StretchHorizontal,
	X
} from "lucide-react";
import { type FC, useMemo } from "react";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	withErrorBoundary
} from "@/shared/ui";
import {
	formatPluralUiText,
	formatUiText,
	useUiContent
} from "@/shared/ui-content";

import {
	CatalogTourCard,
	CatalogTourCardHorizontal,
	CatalogTourCardHorizontalSkeleton,
	CatalogTourCardSkeleton
} from "@/entities/tour";

import { getActiveCatalogFilterChips } from "../lib/get-active-filter-chips";
import { useCatalogTours } from "../model";

import { CatalogHeroSection } from "./catalog-hero-section";
import { CatalogToursFilter } from "./catalog-tours-filter";
import { CatalogToursSimilar } from "./catalog-tours-similar";

const CatalogToursBase: FC = () => {
	const { catalog } = useUiContent();
	const {
		methods,
		locationForm,
		applyLocationBarSubmit,
		page,
		limit,
		tours,
		totalCount,
		totalPages,
		isLoading,
		viewMode,
		setViewMode,
		filtersOpen,
		setFiltersOpen,
		handleReset,
		handleSetFilterValues,
		handlePrevPage,
		handleNextPage,
		similarParams,
		filters
	} = useCatalogTours();

	const activeChips = useMemo(
		() =>
			getActiveCatalogFilterChips(
				filters,
				{
					fields: catalog.filters.fields,
					durations: catalog.filters.durations
				},
				handleSetFilterValues
			),
		[
			filters,
			catalog.filters.fields,
			catalog.filters.durations,
			handleSetFilterValues
		]
	);

	const isBusy = isLoading;

	return (
		<div className="flex flex-col">
			<CatalogHeroSection
				form={locationForm}
				onSubmit={applyLocationBarSubmit}
			/>

			<div className="flex w-full flex-col gap-12 pt-28 sm:gap-14 sm:pt-32 lg:gap-16">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)]">
					<aside className="hidden lg:block">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between px-3 py-3">
								<CardTitle className="text-lg font-semibold">
									{catalog.filters.title}
								</CardTitle>
								<Button
									size="sm"
									onClick={handleReset}
									className="text-destructive h-auto bg-transparent p-0 hover:bg-transparent"
								>
									{catalog.filters.buttons.reset}
								</Button>
							</CardHeader>
							<CardContent className="px-3 pb-3">
								<CatalogToursFilter form={methods} />
							</CardContent>
						</Card>
					</aside>

					<div className="flex min-w-0 flex-col gap-12">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-1">
								<p className="text-xl font-semibold">
									{formatPluralUiText(
										catalog.header.found,
										totalCount
									)}
								</p>

								<div className="flex items-center gap-1">
									<Button
										type="button"
										variant={
											viewMode === "grid"
												? "secondary"
												: "ghost"
										}
										size="icon"
										aria-label={catalog.view.grid}
										onClick={() => setViewMode("grid")}
									>
										<LayoutGrid className="size-4" />
									</Button>
									<Button
										type="button"
										variant={
											viewMode === "list"
												? "secondary"
												: "ghost"
										}
										size="icon"
										aria-label={catalog.view.list}
										onClick={() => setViewMode("list")}
									>
										<StretchHorizontal className="size-4" />
									</Button>
									<Button
										type="button"
										variant="outline"
										size="icon"
										className="relative lg:hidden"
										aria-label={catalog.toolbar.filters}
										onClick={() => setFiltersOpen(true)}
									>
										<SlidersHorizontal className="size-4" />
										{activeChips.length > 0 && (
											<Badge className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full p-0 text-[10px]">
												{activeChips.length}
											</Badge>
										)}
									</Button>
								</div>
							</div>

							{activeChips.length > 0 && (
								<div className="flex items-center gap-2 overflow-x-auto pb-1">
									<Button
										type="button"
										aria-label={
											catalog.toolbar.clearFilters
										}
										onClick={handleReset}
										className="bg-secondary text-secondary-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full"
									>
										<X className="size-3.5" />
									</Button>
									{activeChips.map((chip) => (
										<Badge
											key={chip.id}
											className="bg-secondary text-secondary-foreground inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs"
										>
											{chip.label}
											<button
												onClick={chip.onRemove}
												className="p-1 cursor-pointer"
											>
												<X className="size-3 opacity-70" />
											</button>
										</Badge>
									))}
								</div>
							)}

							{viewMode === "grid" ? (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
									{isBusy
										? Array.from({
												length: limit
											}).map((_, index) => (
												<CatalogTourCardSkeleton
													key={`skeleton-${index}`}
												/>
											))
										: tours.map((tour) => (
												<CatalogTourCard
													key={tour.id}
													data={tour}
												/>
											))}
								</div>
							) : (
								<div className="flex flex-col gap-3">
									{isBusy
										? Array.from({
												length: limit
											}).map((_, index) => (
												<CatalogTourCardHorizontalSkeleton
													key={`skeleton-${index}`}
												/>
											))
										: tours.map((tour) => (
												<CatalogTourCardHorizontal
													key={tour.id}
													data={tour}
												/>
											))}
								</div>
							)}

							<div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3">
								<Button
									variant="outline"
									size="sm"
									disabled={page <= 1 || isBusy}
									onClick={handlePrevPage}
								>
									{catalog.pagination.prev}
								</Button>
								<span className="text-muted-foreground truncate text-center text-xs sm:text-sm">
									{formatUiText(catalog.pagination.page, {
										page,
										total: totalPages
									})}
								</span>
								<Button
									variant="outline"
									size="sm"
									disabled={page >= totalPages || isBusy}
									onClick={handleNextPage}
								>
									{catalog.pagination.next}
								</Button>
							</div>
						</div>
					</div>
				</div>

				<CatalogToursSimilar params={similarParams} />
			</div>

			<Drawer
				open={filtersOpen}
				onOpenChange={setFiltersOpen}
				direction="bottom"
			>
				<DrawerContent className="mt-0! flex h-[100dvh]! max-h-[100dvh]! w-full flex-col rounded-none">
					<DrawerHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b px-4 py-3">
						<DrawerTitle>{catalog.filters.title}</DrawerTitle>
						<div className="flex items-center gap-1">
							<Button
								size="sm"
								onClick={handleReset}
								className="text-destructive h-auto bg-transparent px-2 py-1 hover:bg-transparent"
							>
								{catalog.filters.buttons.reset}
							</Button>
							<DrawerClose asChild>
								<Button variant="ghost" size="icon">
									<X className="size-4" />
								</Button>
							</DrawerClose>
						</div>
					</DrawerHeader>
					<div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
						<CatalogToursFilter form={methods} />
					</div>
					<DrawerFooter className="shrink-0 border-t">
						<Button
							type="button"
							className="w-full"
							onClick={() => setFiltersOpen(false)}
						>
							{catalog.filters.buttons.apply}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export const CatalogTours = withErrorBoundary(CatalogToursBase);
