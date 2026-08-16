import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

import { ENUM_PATH } from "@/shared/config";
import { usePathname, useRouter } from "@/shared/i18n";

import {
	type ICatalogTourFilters,
	type TSearchTours,
	areCatalogQueryStringsEqual,
	buildCatalogQueryString,
	mapCatalogFiltersToCatalogQuery,
	mapCatalogQueryToCatalogFilters,
	mapCatalogQueryToLocationBar,
	mapLocationBarToCatalogQuery,
	mergeCatalogQuery,
	parseCatalogQuery
} from "@/entities/tour";

import { DEFAULT_CATALOG_FILTERS } from "../config/catalog-tours.config";

interface IUseCatalogUrlSyncParams {
	filtersForm: UseFormReturn<ICatalogTourFilters>;
	locationForm: UseFormReturn<TSearchTours>;
}

export const useCatalogUrlSync = ({
	filtersForm,
	locationForm
}: IUseCatalogUrlSyncParams) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const isHydratingRef = useRef(false);
	const search = searchParams.toString();

	const writeUrl = useCallback(
		(query: ReturnType<typeof parseCatalogQuery>) => {
			if (isHydratingRef.current) return;

			if (areCatalogQueryStringsEqual(search, query)) {
				return;
			}

			const qs = buildCatalogQueryString(query);
			const href = qs ? `${pathname}?${qs}` : pathname;

			router.replace(href);
		},
		[pathname, router, search]
	);

	const hydrateFromUrl = useCallback(() => {
		isHydratingRef.current = true;

		const query = parseCatalogQuery(search);
		const nextFilters = mapCatalogQueryToCatalogFilters(
			query,
			DEFAULT_CATALOG_FILTERS
		);
		const nextLocationBar = mapCatalogQueryToLocationBar(query);

		filtersForm.reset(nextFilters);
		locationForm.reset(nextLocationBar);

		window.setTimeout(() => {
			isHydratingRef.current = false;
		}, 0);
	}, [filtersForm, locationForm, search]);

	useEffect(() => {
		hydrateFromUrl();
	}, [hydrateFromUrl]);

	const applyLocationBarSubmit = useCallback(
		(data: TSearchTours) => {
			const fromFilters = mapCatalogFiltersToCatalogQuery(
				filtersForm.getValues()
			);
			const fromBar = mapLocationBarToCatalogQuery(data);
			const query = mergeCatalogQuery(fromFilters, {
				...fromBar,
				page: 1
			});

			writeUrl(query);
		},
		[filtersForm, writeUrl]
	);

	const syncUrlFromFilters = useCallback(() => {
		const current = parseCatalogQuery(search);
		const fromFilters = mapCatalogFiltersToCatalogQuery(
			filtersForm.getValues()
		);

		writeUrl(
			mergeCatalogQuery(fromFilters, {
				checkIn: current.checkIn,
				checkOut: current.checkOut
			})
		);
	}, [filtersForm, search, writeUrl]);

	const handleReset = useCallback(() => {
		isHydratingRef.current = true;

		filtersForm.reset(DEFAULT_CATALOG_FILTERS);
		locationForm.reset({ destination: null, dates: undefined });

		router.replace(pathname || ENUM_PATH.TOURS.CATALOG);

		window.setTimeout(() => {
			isHydratingRef.current = false;
		}, 0);
	}, [filtersForm, locationForm, pathname, router]);

	return {
		applyLocationBarSubmit,
		syncUrlFromFilters,
		handleReset,
		isHydratingRef
	};
};
