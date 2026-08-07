import type { TUiCatalog } from "@/shared/ui-content";

import {
	type ENUM_CATALOG_DURATION_TYPE,
	type ENUM_LANGUAGES_TYPE,
	type ENUM_TOUR_CATEGORY_TYPE,
	type ICatalogTourFilters,
	LANGUAGES_LABELS,
	TOUR_CATEGORY_LABELS
} from "@/entities/tour";

const PRICE_MIN = 0;
const PRICE_MAX = 3600;

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

	for (const region of values.region ?? []) {
		chips.push({
			id: `region:${region}`,
			label: region,
			onRemove: () =>
				setFilters({
					...values,
					region: (values.region ?? []).filter(
						(item) => item !== region
					)
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

	const price = values.price;
	if (price && (price.from > PRICE_MIN || price.to < PRICE_MAX)) {
		chips.push({
			id: "price",
			label: `${labels.fields.price}: ${price.from}–${price.to}`,
			onRemove: () =>
				setFilters({
					...values,
					price: { from: PRICE_MIN, to: PRICE_MAX }
				})
		});
	}

	return chips;
}
