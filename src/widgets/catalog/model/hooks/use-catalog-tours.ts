import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useDebounce } from "@/shared/hooks";
import { useUiContent } from "@/shared/ui-content";

import { mapLocaleToLanguageCode } from "@/entities/geo";
import {
	type ICatalogTourFilters,
	type TSearchTours,
	useGetCatalogToursQuery
} from "@/entities/tour";

import {
	DEFAULT_CATALOG_FILTERS,
	type TCatalogViewMode
} from "../config/catalog-tours.config";

import { useCatalogUrlSync } from "./use-catalog-url-sync";

export const useCatalogTours = () => {
	const { catalog } = useUiContent();
	const locale = useLocale();
	const [viewMode, setViewMode] = useState<TCatalogViewMode>("grid");
	const [filtersOpen, setFiltersOpen] = useState(false);

	const readLang = useMemo(() => mapLocaleToLanguageCode(locale), [locale]);

	const methods = useForm<ICatalogTourFilters>({
		defaultValues: DEFAULT_CATALOG_FILTERS
	});

	const locationForm = useForm<TSearchTours>({
		defaultValues: {
			destination: null,
			dates: undefined
		}
	});

	const { watch, setValue } = methods;
	const formValues = watch();
	const { search, page, limit, filters: filterValues } = formValues;

	const {
		applyLocationBarSubmit,
		syncUrlFromFilters,
		handleReset: handleUrlReset,
		isHydratingRef
	} = useCatalogUrlSync({
		filtersForm: methods,
		locationForm
	});

	const debouncedSource = useMemo(() => filterValues, [filterValues]);
	const debouncedFilters = useDebounce(debouncedSource, 500);

	useEffect(() => {
		if (isHydratingRef.current) return;

		syncUrlFromFilters();
	}, [debouncedFilters, page, limit, isHydratingRef, syncUrlFromFilters]);

	const {
		data: toursData,
		isLoading: isLoadingTours,
		isFetching: isFetchingTours,
		isError
	} = useGetCatalogToursQuery({
		search,
		page,
		limit,
		readLang,
		filters: debouncedFilters
	});

	useEffect(() => {
		if (isError) {
			toast.error(catalog.toasts.loadError);
		}
	}, [isError, catalog.toasts.loadError]);

	const tours = toursData?.data ?? [];
	const totalCount = toursData?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / limit));
	const isLoading = isLoadingTours || isFetchingTours;

	const handleReset = useCallback(() => {
		handleUrlReset();
	}, [handleUrlReset]);

	const handleSetFilterValues = useCallback(
		(next: ICatalogTourFilters["filters"]) => {
			setValue("filters", next);
			setValue("page", 1);
		},
		[setValue]
	);

	const handlePrevPage = useCallback(() => {
		if (page <= 1) return;
		setValue("page", page - 1);
	}, [page, setValue]);

	const handleNextPage = useCallback(() => {
		if (page >= totalPages) return;
		setValue("page", page + 1);
	}, [page, setValue, totalPages]);

	const similarParams = useMemo(
		() => ({
			search,
			page: 1,
			limit,
			readLang,
			filters: {
				...debouncedFilters,
				duration: []
			}
		}),
		[search, limit, readLang, debouncedFilters]
	);

	return {
		methods,
		locationForm,
		applyLocationBarSubmit,
		search,
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
		filters: formValues
	};
};
