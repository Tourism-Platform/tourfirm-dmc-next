export type TAdminNavSection = {
	label: string;
	items: string[];
};

export const ADMIN_COLLECTION_NAVIGATION: TAdminNavSection[] = [
	{
		label: "🌍 Destination",
		items: [
			"countries",
			"regions",
			"cities",
			"attractions",
			"routes",
			"map-points",
			"experiences"
		]
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

export const ADMIN_GLOBALS_NAVIGATION: TAdminNavSection = {
	label: "Globals",
	items: ["homepage", "destination", "site-settings", "header", "footer"]
};
