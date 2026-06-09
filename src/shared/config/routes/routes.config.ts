export const ENUM_PATH = {
	MAIN: {
		ROOT: "/",
		DESTINATIONS: "/destinations",
		CATALOG: "/catalog"
	},
	PARTNERS: {
		AGENCIES: "/partners/agencies",
		HOTELS: "/partners/hotels"
	},
	COMPANY: {
		ABOUT: "/company/about",
		HOW_WE_WORK: "/company/how-we-work",
		PARTNERSHIP: "/company/partnership",
		NEWS: "/company/news",
		FEEDBACK: "/company/feedback"
	},
	LEGAL: {
		TERMS: "/legal/terms",
		PRIVACY: "/legal/privacy"
	},
	HELP: {
		SUPPORT: "/help/support",
		CONTACT: "/help/contact",
		FAQ: "/help/faq",
		TRAINING: "/help/training",
		MORE_INFO: "/help/more-info"
	}
} as const;
