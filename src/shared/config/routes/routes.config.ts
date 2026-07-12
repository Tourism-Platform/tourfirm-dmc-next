export const ENUM_PATH = {
	MAIN: {
		ROOT: "/",
		DESTINATIONS: "/destinations",
		CATALOG: "/catalog"
	},
	DISCOVERY: {
		ROUTES: "/routes",
		EXPERIENCES: "/experiences",
		BLOG: "/blog",
		routeDetail: (slug: string) => `/routes/${slug}`,
		experienceDetail: (slug: string) => `/experiences/${slug}`,
		themeDetail: (slug: string) => `/themes/${slug}`,
		blogDetail: (slug: string) => `/blog/${slug}`
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
		newsDetail: (slug: string) => `/company/news/${slug}`,
		TRADE_FAIRS: "/company/trade-fairs",
		tradeFairDetail: (slug: string) => `/company/trade-fairs/${slug}`,
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
