import type { TUiCatalog } from "./ui-catalog.types";

export const DEFAULT_UI_CATALOG: TUiCatalog = {
	meta: {
		title: "Tour catalog",
		description: "Browse and filter tours"
	},
	hero: {
		title: "Catalog"
	},
	header: {
		found: "{count, plural, one {# Tour Found on Your Search} other {# Tours Found on Your Search}}"
	},
	filters: {
		title: "Filters",
		fields: {
			price: "Price per traveler",
			region: "Region",
			country: "Country",
			city: "City",
			duration: "Duration of the tour",
			language: "Language",
			category: "Category"
		},
		durations: {
			halfDay: "Half day",
			fullDay: "Full day",
			multiDays: "Multi days"
		},
		buttons: {
			reset: "Reset",
			apply: "Apply"
		}
	},
	toolbar: {
		filters: "Filters",
		clearFilters: "Clear filters"
	},
	view: {
		grid: "Grid view",
		list: "List view"
	},
	toasts: {
		loadError: "Error loading catalog"
	},
	alert: {
		title: "Similar options:",
		description:
			"These options match your search criteria but are outside the dates you specified."
	},
	popularTours: {
		title: "Most Popular Tours"
	},
	pagination: {
		prev: "Previous",
		next: "Next",
		page: "Page {page} of {total}"
	}
};
