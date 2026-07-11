export const MEDIA_CATEGORY_OPTIONS = [
	{ label: "Homepage", value: "homepage" },
	{ label: "Destinations", value: "destinations" },
	{ label: "Countries", value: "countries" },
	{ label: "Regions", value: "regions" },
	{ label: "Cities", value: "cities" },
	{ label: "Attractions", value: "attractions" },
	{ label: "Routes", value: "routes" },
	{ label: "Experiences", value: "experiences" },
	{ label: "Themes", value: "themes" },
	{ label: "Partners", value: "partners" },
	{ label: "General", value: "general" }
] as const;

export const MEDIA_LICENSE_OPTIONS = [
	{ label: "All rights reserved", value: "all-rights-reserved" },
	{ label: "CC BY", value: "cc-by" },
	{ label: "CC BY-SA", value: "cc-by-sa" },
	{ label: "Public domain", value: "public-domain" },
	{ label: "Proprietary", value: "proprietary" },
	{ label: "Unknown", value: "unknown" }
] as const;

export const MEDIA_RIGHTS_STATUS_OPTIONS = [
	{ label: "Cleared", value: "cleared" },
	{ label: "Pending", value: "pending" },
	{ label: "Restricted", value: "restricted" },
	{ label: "Unknown", value: "unknown" }
] as const;
