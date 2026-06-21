export const ENUM_PATH = {
	MAIN: {
		ROOT: "/",
		DESTINATIONS: "/destinations",
		SEARCH: "/search",
		CATALOG: {
			ROOT: "/catalog",
			TOUR: "/catalog/:tourId",
			TOUR_OPTION: "/catalog/:tourId/option/:optionId"
		}
	},
	PARTNERS: {
		AGENCIES: "/partners/agencies",
		HOTELS: "/partners/hotels"
	},
	COMPANY: {
		ABOUT: "/company/about",
		SERVICES: "/company/services",
		PARTNERSHIP: "/company/partnership",
		NEWS: "/company/news",
		FEEDBACK: "/company/feedback"
	},
	LEGAL: {
		TERMS: "/legal/terms",
		PRIVACY: "/legal/privacy",
		COOKIES: "/legal/cookies",
		CANCELLATION: "/legal/cancellation",
		BOOKING: "/legal/booking"
	},
	HELP: {
		SUPPORT: "/help/support",
		CONTACT: "/help/contact",
		FAQ: "/help/faq",
		TRAINING: "/help/training",
		MORE_INFO: "/help/more-info"
	}
} as const;
