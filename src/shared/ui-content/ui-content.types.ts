import type { TUiBooking } from "./ui-booking.types";
import type { TUiCatalog } from "./ui-catalog.types";
import type { TUiOrders } from "./ui-orders.types";
import type { TUiPreview } from "./ui-preview.types";

export type TUiMeta = {
	title: string;
	description: string;
};

export type TUiHeader = {
	public: {
		nav: {
			destinations: {
				label: string;
				viewAll: string;
				columns: {
					countries: { title: string; subtitle: string };
					regions: { title: string; subtitle: string };
					cities: { title: string; subtitle: string };
				};
			};
			routes: {
				columns: { title: string };
				viewAll: string;
			};
			experiences: {
				columns: { title: string };
				viewAll: string;
			};
			information?: {
				areasLabel: string;
				viewAll: string;
			};
			mobileMenu: string;
			comingSoon: string;
		};
	};
	userMenu: {
		login: string;
		logout: string;
		defaultUserName: string;
	};
};

export type TUiFooter = {
	brand: { name: string; tagline?: string };
	community?: { title: string; subtitle: string };
	comingSoon: string;
	copyright: string;
};

export type TUiCommon = {
	meta: TUiMeta;
	actions: { showMore: string };
	uploadFiles: {
		title: string;
		empty: string;
		description: string;
		uploaded: string;
		buttons: { add: string; remove: string; select: string };
	};
	table: {
		search: string;
		status: string;
		pagination: string;
		view: { title: string; toggle: string };
		emptyState: { title: string; description: string };
	};
	datePicker: {
		placeholder: string;
		buttons: { apply: string; reset: string };
	};
	uploadImages: {
		title: string;
		description: string;
		uploaded: string;
		total: string;
		formats: string;
		buttons: { add: string; clear: string; select: string };
	};
	uploadMainImage: {
		title: string;
		description: string;
		formats: string;
		errors: { title: string; remove: string };
	};
	multiselect: { selected: string };
	filters: { price: { from: string; to: string } };
	themeToggle: { light: string; dark: string; system: string };
	languageToggle: { en: string; ru: string; uz: string };
};

export type TUiTours = {
	meta: TUiMeta;
	hero: { title: string };
	search: {
		where: {
			label: string;
			placeholder: string;
			empty: string;
			required: string;
		};
		when: { label: string; placeholder: string };
		submit: string;
	};
	recent: {
		title: string;
		tourType: { group: string; private: string };
	};
	popular: { title: string };
	blog: { title: string; readMore: string; viewAll: string };
	offers: { title: string; subtitle: string; cta: string };
	destinations: { title: string; count: string; viewAll: string };
	card: {
		recommended: string;
		reviews: string;
		durationDays: string;
		freeCancellation: string;
		priceFrom: string;
		bookNow: string;
		duration: string;
		group: string;
		age: string;
		options: string;
	};
	toasts: { loadError: string };
};

export type TUiPaginationLabels = {
	paginationPrev: string;
	paginationNext: string;
};

export type TUiDiscovery = {
	geoBreadcrumbLabel: string;
	paginationAriaLabel: string;
	blog: TUiPaginationLabels;
	routes: TUiPaginationLabels;
	experiences: TUiPaginationLabels;
	news: TUiPaginationLabels;
	tradeFairs: TUiPaginationLabels;
};

export type TUiLogin = {
	meta: TUiMeta;
	form: {
		title: string;
		description: string;
		googleButton: string;
		trustNote: string;
	};
	sidePanel: {
		brandLabel: string;
		title: string;
		subtitle: string;
		quote: string;
	};
};

export type { TUiBooking } from "./ui-booking.types";
export type { TUiCatalog } from "./ui-catalog.types";
export type { TUiOrders } from "./ui-orders.types";
export type { TUiPreview } from "./ui-preview.types";

export type TUiContent = {
	header: TUiHeader;
	footer: TUiFooter;
	common: TUiCommon;
	tours: TUiTours;
	catalog: TUiCatalog;
	orders: TUiOrders;
	discovery: TUiDiscovery;
	login: TUiLogin;
	preview: TUiPreview;
	booking: TUiBooking;
};

export type TLanguageSetting = {
	label: string;
	enabled: boolean;
	showInDropdown: boolean;
};

export type TLocaleAvailability = Record<string, TLanguageSetting>;

export type TDropdownLanguage = {
	code: string;
	label: string;
};

export type TDiscoveryPaginationKey =
	| "blog"
	| "routes"
	| "experiences"
	| "news"
	| "tradeFairs";
