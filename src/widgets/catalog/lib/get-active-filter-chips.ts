import type { TUiCatalog } from "@/shared/ui-content";

import {
	type ENUM_CATALOG_DURATION_TYPE,
	type ENUM_LANGUAGES_TYPE,
	type ENUM_TOUR_CATEGORY_TYPE,
	type ICatalogTourFilters,
	LANGUAGES_LABELS,
	TOUR_CATEGORY_LABELS
} from "@/entities/tour";

export type TCatalogFilterChip = {
	id: string;
	label: string;
	onRemove: () => void;
};

type TChipLabels = {
	fields: TUiCatalog["filters"]["fields"];
	durations: TUiCatalog["filters"]["durations"];
};

export function getActiveCatalogFilterChips(
	filters: ICatalogTourFilters,
	labels: TChipLabels,
	setFilters: (next: ICatalogTourFilters["filters"]) => void
): TCatalogFilterChip[] {
	const values = filters.filters ?? {};
	const chips: TCatalogFilterChip[] = [];

	const durationLabelMap: Record<ENUM_CATALOG_DURATION_TYPE, string> = {
		half_day: labels.durations.halfDay,
		full_day: labels.durations.fullDay,
		multi_days: labels.durations.multiDays
	};

	for (const country of values.country ?? []) {
		chips.push({
			id: `country:${country}`,
			label: country,
			onRemove: () =>
				setFilters({
					...values,
					country: (values.country ?? []).filter(
						(item) => item !== country
					)
				})
		});
	}

	for (const city of values.city ?? []) {
		chips.push({
			id: `city:${city}`,
			label: city,
			onRemove: () =>
				setFilters({
					...values,
					city: (values.city ?? []).filter((item) => item !== city)
				})
		});
	}

	for (const duration of values.duration ?? []) {
		chips.push({
			id: `duration:${duration}`,
			label: durationLabelMap[duration] ?? duration,
			onRemove: () =>
				setFilters({
					...values,
					duration: (values.duration ?? []).filter(
						(item) => item !== duration
					)
				})
		});
	}

	for (const language of values.language ?? []) {
		chips.push({
			id: `language:${language}`,
			label:
				LANGUAGES_LABELS[language as ENUM_LANGUAGES_TYPE] ?? language,
			onRemove: () =>
				setFilters({
					...values,
					language: (values.language ?? []).filter(
						(item) => item !== language
					)
				})
		});
	}

	for (const category of values.category ?? []) {
		chips.push({
			id: `category:${category}`,
			label:
				TOUR_CATEGORY_LABELS[category as ENUM_TOUR_CATEGORY_TYPE] ??
				category.replaceAll("_", " "),
			onRemove: () =>
				setFilters({
					...values,
					category: (values.category ?? []).filter(
						(item) => item !== category
					)
				})
		});
	}

	return chips;
}
