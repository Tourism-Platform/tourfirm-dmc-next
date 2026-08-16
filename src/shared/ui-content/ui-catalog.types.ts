import type { TUiMeta } from "./ui-content.types";

export type TUiCatalog = {
	meta: TUiMeta;
	hero: {
		title: string;
	};
	header: {
		found: string;
	};
	filters: {
		title: string;
		fields: {
			price: string;
			region: string;
			country: string;
			city: string;
			duration: string;
			language: string;
			category: string;
		};
		durations: {
			halfDay: string;
			fullDay: string;
			multiDays: string;
		};
		buttons: {
			reset: string;
			apply: string;
		};
	};
	toolbar: {
		filters: string;
		clearFilters: string;
	};
	view: {
		grid: string;
		list: string;
	};
	toasts: {
		loadError: string;
	};
	alert: {
		title: string;
		description: string;
	};
	popularTours: {
		title: string;
	};
	pagination: {
		prev: string;
		next: string;
		page: string;
	};
};
