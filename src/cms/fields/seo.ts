import type { Field } from "payload";

const structuredDataTypeOptions = [
	{ label: "WebPage", value: "WebPage" },
	{ label: "TouristDestination", value: "TouristDestination" },
	{ label: "TouristAttraction", value: "TouristAttraction" },
	{ label: "TouristTrip", value: "TouristTrip" },
	{ label: "Article", value: "Article" }
] as const;

export const seoField: Field = {
	name: "seo",
	type: "group",
	localized: true,
	fields: [
		{
			name: "metaTitle",
			type: "text",
			localized: true
		},
		{
			name: "metaDescription",
			type: "textarea",
			localized: true
		},
		{
			name: "canonicalOverride",
			type: "text"
		},
		{
			name: "ogTitle",
			type: "text",
			localized: true
		},
		{
			name: "ogDescription",
			type: "textarea",
			localized: true
		},
		{
			name: "ogImage",
			type: "upload",
			relationTo: "media"
		},
		{
			name: "robotsNoindex",
			type: "checkbox",
			localized: true,
			defaultValue: false
		},
		{
			name: "structuredDataType",
			type: "select",
			localized: true,
			options: [...structuredDataTypeOptions]
		}
	]
};
