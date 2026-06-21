"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search as SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ENUM_PATH, buildRouteWithQuery } from "@/shared/config";
import { useDebounce } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	withErrorBoundary
} from "@/shared/ui";

import {
	CatalogTourCard,
	CatalogTourCardSkeleton,
	type ICatalogTourFilters,
	type TSearchTours,
	mapCatalogQueryToSearchTours,
	searchToursSchema,
	useGetCatalogToursQuery
} from "@/entities/tour";

import { BookTourModal } from "@/features/booking/book-tour";
import { SearchToursBar } from "@/features/tours";

import { SearchFilter } from "./search-filter";
import { SearchSimilar } from "./search-similar";

const PAGE_SIZE = 9;

const DEFAULT_FILTERS: ICatalogTourFilters = {
	search: "",

	page: 1,

	limit: PAGE_SIZE,

	filters: {
		region: [],

		duration: [],

		language: [],

		category: [],

		price: {
			from: 0,

			to: 3600
		}
	}
};

const SearchBase: FC = () => {
	const t = useTranslations("search_page");

	const router = useRouter();

	const searchParams = useSearchParams();

	const destination = "";

	const checkIn = searchParams.get("checkIn") ?? "";

	const checkOut = searchParams.get("checkOut") ?? "";

	const page = Number(searchParams.get("page")) || 1;

	const urlSearch = searchParams.get("search") ?? "";

	const searchForm = useForm<TSearchTours>({
		resolver: zodResolver(searchToursSchema),

		defaultValues: mapCatalogQueryToSearchTours({
			destination,

			checkIn: checkIn || undefined,

			checkOut: checkOut || undefined
		})
	});

	const filtersForm = useForm<ICatalogTourFilters>({
		defaultValues: DEFAULT_FILTERS
	});

	const watchedFilters = useWatch({
		control: filtersForm.control,
		name: "filters",
		defaultValue: DEFAULT_FILTERS.filters
	});

	useEffect(() => {
		searchForm.reset(
			mapCatalogQueryToSearchTours({
				destination,

				checkIn: checkIn || undefined,

				checkOut: checkOut || undefined
			})
		);
	}, [destination, checkIn, checkOut, searchForm]);

	const [textSearch, setTextSearch] = useState(urlSearch);
	const debouncedSearch = useDebounce(textSearch, 400);

	const debouncedFilters = useDebounce(
		watchedFilters ?? DEFAULT_FILTERS.filters,
		500
	);

	const queryParams = useMemo<ICatalogTourFilters>(
		() => ({
			search: debouncedSearch || undefined,

			page,

			limit: PAGE_SIZE,

			destination: destination || undefined,

			checkIn: checkIn || undefined,

			checkOut: checkOut || undefined,

			filters: debouncedFilters
		}),

		[
			debouncedSearch,
			page,
			destination,
			checkIn,
			checkOut,
			debouncedFilters
		]
	);

	const similarParams = useMemo<ICatalogTourFilters>(
		() => ({
			...queryParams,

			filters: {
				...debouncedFilters,

				duration: []
			}
		}),

		[queryParams, debouncedFilters]
	);

	const { data, isLoading, isFetching, isError } =
		useGetCatalogToursQuery(queryParams);

	useEffect(() => {
		if (isError) {
			toast.error(t("toasts.load.error"));
		}
	}, [isError, t]);

	const tours = data?.data ?? [];

	const totalCount = data?.total ?? 0;

	const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

	const buildSearchRoute = useCallback(
		(overrides: {
			search?: string;

			page?: number;
		}) =>
			buildRouteWithQuery(ENUM_PATH.MAIN.SEARCH, {
				destination: destination || undefined,

				checkIn: checkIn || undefined,

				checkOut: checkOut || undefined,

				search: overrides.search || undefined,

				page:
					overrides.page && overrides.page > 1
						? overrides.page
						: undefined
			}),

		[destination, checkIn, checkOut]
	);

	useEffect(() => {
		if (debouncedSearch === urlSearch) return;

		router.replace(buildSearchRoute({ search: debouncedSearch, page: 1 }));
	}, [debouncedSearch, urlSearch, router, buildSearchRoute]);

	const handlePageChange = useCallback(
		(nextPage: number) => {
			router.push(
				buildSearchRoute({ search: debouncedSearch, page: nextPage })
			);
		},

		[router, buildSearchRoute, debouncedSearch]
	);

	const handleResetFilters = useCallback(() => {
		filtersForm.reset(DEFAULT_FILTERS);
	}, [filtersForm]);

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
			<SearchToursBar form={searchForm} />

			<div className="grid gap-6 lg:grid-cols-[minmax(280px,400px)_1fr]">
				<aside className="flex flex-col gap-4">
					<Card>
						<CardHeader className="flex items-center justify-between">
							<CardTitle className="text-xl font-semibold">
								{t("filters.title")}
							</CardTitle>

							<Button
								size="sm"
								onClick={handleResetFilters}
								className="text-destructive h-auto bg-transparent p-0 hover:bg-transparent"
							>
								{t("filters.buttons.reset")}
							</Button>
						</CardHeader>

						<CardContent>
							<SearchFilter form={filtersForm} />
						</CardContent>
					</Card>
				</aside>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xl font-semibold">
							{t("header.found", { count: totalCount })}
						</p>

						<div className="relative w-full sm:max-w-sm">
							<SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

							<Input
								value={textSearch}
								onChange={(event) =>
									setTextSearch(event.target.value)
								}
								placeholder={t("search.placeholder")}
								className="pl-9"
							/>
						</div>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
						{isLoading || isFetching
							? Array.from({ length: PAGE_SIZE }).map(
									(_, index) => (
										<CatalogTourCardSkeleton key={index} />
									)
								)
							: tours.map((tour) => (
									<CatalogTourCard
										key={tour.id}
										data={tour}
										action={
											<BookTourModal
												tour={{
													id: tour.id,

													title: tour.title
												}}
											/>
										}
									/>
								))}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-3">
							<Button
								variant="outline"
								size="sm"
								disabled={page <= 1}
								onClick={() => handlePageChange(page - 1)}
							>
								{t("pagination.previous")}
							</Button>

							<span className="text-muted-foreground text-sm">
								{page} / {totalPages}
							</span>

							<Button
								variant="outline"
								size="sm"
								disabled={page >= totalPages}
								onClick={() => handlePageChange(page + 1)}
							>
								{t("pagination.next")}
							</Button>
						</div>
					)}

					{(checkIn || checkOut) && (
						<SearchSimilar params={similarParams} />
					)}
				</div>
			</div>
		</section>
	);
};

export const Search = withErrorBoundary(SearchBase);
