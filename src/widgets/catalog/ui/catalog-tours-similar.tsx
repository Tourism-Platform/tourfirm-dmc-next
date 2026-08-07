"use client";

import { Search } from "lucide-react";
import {
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Carousel,
	type CarouselApi,
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
	type ICatalogTourCard,
	type ICatalogTourFilters,
	useGetCatalogToursQuery
} from "@/entities/tour";

const PREFETCH_OFFSET = 2;
const SKELETON_COUNT = 3;
const SIMILAR_LIMIT = 6;
const ITEM_CLASS = "basis-full pl-3 sm:basis-1/2 sm:pl-4 lg:basis-[31%]";

type TCatalogToursSimilarProps = {
	params: ICatalogTourFilters;
};

type TSyncedTours = {
	data: ReturnType<typeof useGetCatalogToursQuery>["data"];
	page: number;
	tours: ICatalogTourCard[];
	total: number;
};

const CatalogToursSimilarInner: FC<TCatalogToursSimilarProps> = ({
	params
}) => {
	const { catalog } = useUiContent();
	const [page, setPage] = useState(1);
	const [synced, setSynced] = useState<TSyncedTours>({
		data: undefined,
		page: 1,
		tours: [],
		total: 0
	});
	const [api, setApi] = useState<CarouselApi>();
	const loadingMoreRef = useRef(false);

	const queryParams = useMemo(
		(): ICatalogTourFilters => ({
			...params,
			page,
			limit: SIMILAR_LIMIT
		}),
		[params, page]
	);

	const {
		data: toursData,
		isLoading,
		isFetching
	} = useGetCatalogToursQuery(queryParams);

	if (
		toursData &&
		!isFetching &&
		(synced.data !== toursData || synced.page !== page)
	) {
		const nextTours =
			page === 1
				? toursData.data
				: (() => {
						const seen = new Set(
							synced.tours.map((tour) => tour.id)
						);
						const next = toursData.data.filter(
							(tour) => !seen.has(tour.id)
						);

						return next.length
							? [...synced.tours, ...next]
							: synced.tours;
					})();

		setSynced({
			data: toursData,
			page,
			tours: nextTours,
			total: toursData.total
		});
	}

	const { tours, total } = synced;
	const hasMore = tours.length < total;
	const isInitialLoading = isLoading && page === 1 && tours.length === 0;
	const isLoadingMore = isFetching && page > 1;

	useEffect(() => {
		if (!isFetching) {
			loadingMoreRef.current = false;
		}
	}, [isFetching]);

	const loadMore = useCallback(() => {
		if (!hasMore || isFetching || loadingMoreRef.current) return;

		loadingMoreRef.current = true;
		setPage((current) => current + 1);
	}, [hasMore, isFetching]);

	useEffect(() => {
		if (!api) return;

		const maybePrefetch = (): void => {
			if (!tours.length || !hasMore) return;

			const slidesInView = api.slidesInView();
			const lastVisible =
				slidesInView.length > 0
					? Math.max(...slidesInView)
					: api.selectedScrollSnap();
			const threshold = Math.max(0, tours.length - PREFETCH_OFFSET);

			if (lastVisible >= threshold) {
				loadMore();
			}
		};

		maybePrefetch();
		api.on("select", maybePrefetch);
		api.on("scroll", maybePrefetch);
		api.on("settle", maybePrefetch);
		api.on("reInit", maybePrefetch);

		return () => {
			api.off("select", maybePrefetch);
			api.off("scroll", maybePrefetch);
			api.off("settle", maybePrefetch);
			api.off("reInit", maybePrefetch);
		};
	}, [api, hasMore, loadMore, tours.length]);

	useEffect(() => {
		api?.reInit();
	}, [api, tours.length]);

	return (
		<div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
			<Alert
				variant="warning"
				appearance="light"
				className="px-4 py-4 sm:px-6 sm:py-5"
			>
				<AlertIcon>
					<Search />
				</AlertIcon>
				<AlertContent className="flex min-w-0 flex-col gap-1">
					<AlertTitle className="mb-0">
						{catalog.alert.title}
					</AlertTitle>
					<AlertDescription>
						{catalog.alert.description}
					</AlertDescription>
				</AlertContent>
			</Alert>

			<section className="flex flex-col gap-6 sm:gap-7">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold sm:text-2xl">
						{catalog.popularTours.title}
					</h2>
				</div>
				<Carousel
					opts={{ align: "start" }}
					setApi={setApi}
					className="w-full"
				>
					<CarouselContent className="-ml-3 pb-2 sm:-ml-4">
						{isInitialLoading
							? Array.from({ length: SKELETON_COUNT }).map(
									(_, index) => (
										<CarouselItem
											key={`skeleton-${index}`}
											className={ITEM_CLASS}
										>
											<CatalogTourCardSkeleton />
										</CarouselItem>
									)
								)
							: tours.map((tour) => (
									<CarouselItem
										key={tour.id}
										className={ITEM_CLASS}
									>
										<CatalogTourCard data={tour} />
									</CarouselItem>
								))}
						{isLoadingMore
							? Array.from({ length: SKELETON_COUNT }).map(
									(_, index) => (
										<CarouselItem
											key={`skeleton-more-${index}`}
											className={ITEM_CLASS}
										>
											<CatalogTourCardSkeleton />
										</CarouselItem>
									)
								)
							: null}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			</section>
		</div>
	);
};

const CatalogToursSimilarBase: FC<TCatalogToursSimilarProps> = ({ params }) => {
	const resetKey = useMemo(
		() =>
			JSON.stringify({
				search: params.search,
				filters: params.filters
			}),
		[params.search, params.filters]
	);

	return <CatalogToursSimilarInner key={resetKey} params={params} />;
};

export const CatalogToursSimilar = withErrorBoundary(CatalogToursSimilarBase);
