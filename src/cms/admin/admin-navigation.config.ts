export type TAdminNavSection = {
	label: string;
	items: string[];
};

export const ADMIN_COLLECTION_NAVIGATION: TAdminNavSection[] = [
	{
		label: "🌍 Destination",
		items: ["countries", "regions", "cities", "attractions"]
	},
	{
		label: "🛤 Routes",
		items: ["routes", "map-points"]
	},
	{
		label: "✨ Experiences",
		items: ["experiences"]
	},
	{
		label: "🏛 Trade Fairs",
		items: ["trade-fairs"]
	},
	{
		label: "📖 Blog",
		items: ["blog"]
	},
	{
		label: "📰 News",
		items: ["news"]
	},
	{
		label: "📝 Company",
		items: ["pages", "segments", "themes"]
	},
	{
		label: "💼 Business",
		items: ["badges"]
	},
	{
		label: "⚙️ System",
		items: ["media", "users"]
	}
];

export const ADMIN_DESTINATION_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "🌍 Destination",
	items: ["destination"]
};

export const ADMIN_ROUTES_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "🛤 Routes",
	items: ["routes-hub"]
};

export const ADMIN_EXPERIENCES_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "✨ Experiences",
	items: ["experiences-hub"]
};

export const ADMIN_TRADE_FAIRS_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "🏛 Trade Fairs",
	items: ["trade-fairs-hub"]
};

export const ADMIN_BLOG_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "📖 Blog",
	items: ["blog-hub"]
};

export const ADMIN_NEWS_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "📰 News",
	items: ["news-hub"]
};

export const ADMIN_UI_CONTENT_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "UI Content",
	items: [
		"header",
		"footer",
		"ui-common",
		"ui-tours",
		"ui-catalog",
		"ui-orders",
		"ui-discovery",
		"ui-login",
		"ui-preview",
		"ui-preview-sheet",
		"ui-booking"
	]
};

export const ADMIN_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "Globals",
	items: ["homepage", "tours", "site-settings"]
};

export const ADMIN_ALL_GLOBALS_NAVIGATION: TAdminNavSection[] = [
	ADMIN_DESTINATION_GLOBALS_NAVIGATION,
	ADMIN_ROUTES_GLOBALS_NAVIGATION,
	ADMIN_EXPERIENCES_GLOBALS_NAVIGATION,
	ADMIN_TRADE_FAIRS_GLOBALS_NAVIGATION,
	ADMIN_BLOG_GLOBALS_NAVIGATION,
	ADMIN_NEWS_GLOBALS_NAVIGATION,
	ADMIN_UI_CONTENT_GLOBALS_NAVIGATION,
	ADMIN_GLOBALS_NAVIGATION
];
