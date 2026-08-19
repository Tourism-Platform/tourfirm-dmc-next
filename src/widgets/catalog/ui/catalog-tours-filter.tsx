"use client";

import { Clock, Globe, MapPin, Tag } from "lucide-react";
import { useLocale } from "next-intl";
import { type FC, useCallback, useMemo } from "react";
import { type UseFormReturn } from "react-hook-form";

import { CustomAccordion, withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { mapLocaleToLanguageCode } from "@/entities/geo";
import {
	CATALOG_DURATION_KEYS,
	type ENUM_CATALOG_DURATION_TYPE,
	ENUM_LANGUAGES,
	type ENUM_LANGUAGES_TYPE,
	ENUM_TOUR_CATEGORY,
	type ENUM_TOUR_CATEGORY_TYPE,
	type ICatalogTourFilters,
	LANGUAGES_LABELS,
	TOUR_CATEGORY_LABELS,
	buildCatalogFilterItems,
	buildStringFilterItems,
	useGetCatalogFiltersQuery
} from "@/entities/tour";

type TCatalogToursFilterProps = {
	form: UseFormReturn<ICatalogTourFilters>;
};

const LANGUAGE_KEYS = Object.values(ENUM_LANGUAGES) as ENUM_LANGUAGES_TYPE[];
const CATEGORY_KEYS = Object.values(
	ENUM_TOUR_CATEGORY
) as ENUM_TOUR_CATEGORY_TYPE[];

const CatalogToursFilterBase: FC<TCatalogToursFilterProps> = ({ form }) => {
	const { catalog } = useUiContent();
	const locale = useLocale();
	const { watch, setValue } = form;

	const selectedFilters = watch("filters") || {};
	const readLang = useMemo(() => mapLocaleToLanguageCode(locale), [locale]);

	const { data: catalogFilters, isLoading: isCatalogFiltersLoading } =
		useGetCatalogFiltersQuery({ read_lang: readLang });

	const countryItems = useMemo(
		() =>
			buildStringFilterItems(
				catalogFilters?.countries ?? [],
				selectedFilters.country
			),
		[catalogFilters?.countries, selectedFilters.country]
	);

	const cityItems = useMemo(
		() =>
			buildStringFilterItems(
				catalogFilters?.cities ?? [],
				selectedFilters.city
			),
		[catalogFilters?.cities, selectedFilters.city]
	);

	const durationLabels = useMemo(
		() =>
			({
				half_day: catalog.filters.durations.halfDay,
				full_day: catalog.filters.durations.fullDay,
				multi_days: catalog.filters.durations.multiDays
			}) satisfies Record<ENUM_CATALOG_DURATION_TYPE, string>,
		[catalog.filters.durations]
	);

	const durationItems = useMemo(
		() =>
			CATALOG_DURATION_KEYS.map((id) => ({
				id,
				label: durationLabels[id],
				checked: (selectedFilters.duration ?? []).includes(id)
			})),
		[durationLabels, selectedFilters.duration]
	);

	const languageItems = useMemo(
		() =>
			buildCatalogFilterItems(
				LANGUAGE_KEYS,
				LANGUAGES_LABELS,
				selectedFilters.language
			),
		[selectedFilters.language]
	);

	const categoryItems = useMemo(
		() =>
			buildCatalogFilterItems(
				CATEGORY_KEYS,
				TOUR_CATEGORY_LABELS,
				selectedFilters.category
			),
		[selectedFilters.category]
	);

	const handleCountryChange = useCallback(
		(id: string, checked: boolean) => {
			const currentValues = form.getValues("filters.country") || [];
			const nextValues = checked
				? [...currentValues, id]
				: currentValues.filter((val) => val !== id);

			setValue("filters.country", nextValues);
			setValue("page", 1);
		},
		[form, setValue]
	);

	const handleCityChange = useCallback(
		(id: string, checked: boolean) => {
			const currentValues = form.getValues("filters.city") || [];
			const nextValues = checked
				? [...currentValues, id]
				: currentValues.filter((val) => val !== id);

			setValue("filters.city", nextValues);
			setValue("page", 1);
		},
		[form, setValue]
	);

	const handleDurationChange = useCallback(
		(id: string, checked: boolean) => {
			const current =
				form.getValues("filters.duration") ??
				([] as ENUM_CATALOG_DURATION_TYPE[]);
			const durationId = id as ENUM_CATALOG_DURATION_TYPE;
			const next = checked
				? [...current, durationId]
				: current.filter((val) => val !== durationId);

			setValue("filters.duration", next);
			setValue("page", 1);
		},
		[form, setValue]
	);

	const handleLanguageChange = useCallback(
		(id: string, checked: boolean) => {
			const current =
				form.getValues("filters.language") ??
				([] as ENUM_LANGUAGES_TYPE[]);
			const languageId = id as ENUM_LANGUAGES_TYPE;
			const next = checked
				? [...current, languageId]
				: current.filter((val) => val !== languageId);

			setValue("filters.language", next);
			setValue("page", 1);
		},
		[form, setValue]
	);

	const handleCategoryChange = useCallback(
		(id: string, checked: boolean) => {
			const current =
				form.getValues("filters.category") ??
				([] as ENUM_TOUR_CATEGORY_TYPE[]);
			const categoryId = id as ENUM_TOUR_CATEGORY_TYPE;
			const next = checked
				? [...current, categoryId]
				: current.filter((val) => val !== categoryId);

			setValue("filters.category", next);
			setValue("page", 1);
		},
		[form, setValue]
	);

	return (
		<div className="flex flex-col gap-4">
			<CustomAccordion
				id="country"
				title={catalog.filters.fields.country}
				icon={Globe}
				items={countryItems}
				isLoading={isCatalogFiltersLoading}
				onChange={handleCountryChange}
			/>

			<CustomAccordion
				id="city"
				title={catalog.filters.fields.city}
				icon={MapPin}
				items={cityItems}
				isLoading={isCatalogFiltersLoading}
				onChange={handleCityChange}
			/>

			<CustomAccordion
				id="duration"
				title={catalog.filters.fields.duration}
				icon={Clock}
				items={durationItems}
				onChange={handleDurationChange}
			/>

			<CustomAccordion
				id="language"
				title={catalog.filters.fields.language}
				icon={Globe}
				items={languageItems}
				onChange={handleLanguageChange}
			/>

			<CustomAccordion
				id="category"
				title={catalog.filters.fields.category}
				icon={Tag}
				items={categoryItems}
				onChange={handleCategoryChange}
			/>
		</div>
	);
};

export const CatalogToursFilter = withErrorBoundary(CatalogToursFilterBase);
