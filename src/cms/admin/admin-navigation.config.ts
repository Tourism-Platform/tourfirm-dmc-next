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
		label: "📝 Content",
		items: ["pages", "segments", "journal-entries", "themes"]
	},
	{
		label: "💼 Business",
		items: ["trade-fairs", "badges"]
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

export const ADMIN_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "Globals",
	items: ["homepage", "site-settings", "header", "footer"]
};

export const ADMIN_ALL_GLOBALS_NAVIGATION: TAdminNavSection[] = [
	ADMIN_DESTINATION_GLOBALS_NAVIGATION,
	ADMIN_ROUTES_GLOBALS_NAVIGATION,
	ADMIN_EXPERIENCES_GLOBALS_NAVIGATION,
	ADMIN_GLOBALS_NAVIGATION
];
