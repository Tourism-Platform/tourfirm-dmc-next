import type { Field } from "payload";

const cardTypeOptions = [
	{ label: "Country", value: "country" },
	{ label: "Destination Insight", value: "destinationInsight" },
	{ label: "Route Idea", value: "routeIdea" },
	{ label: "Experience", value: "experience" },
	{ label: "Trade Fair", value: "tradeFair" },
	{ label: "Journal", value: "journal" },
	{ label: "Overview Stat", value: "overviewStat" },
	{ label: "Services Business", value: "servicesBusiness" },
	{ label: "Services Direction", value: "servicesDirection" },
	{ label: "Services Process", value: "servicesProcess" },
	{ label: "Trip Format", value: "tripFormat" }
] as const;

const whenType =
	(...types: string[]) =>
	(_: unknown, siblingData: Record<string, unknown>) =>
		types.includes(String(siblingData?.type));

export const cardFields: Field[] = [
	{
		name: "type",
		type: "select",
		required: true,
		options: [...cardTypeOptions]
	},
	{
		name: "relatedDoc",
		type: "relationship",
		relationTo: ["routes", "experiences", "trade-fairs", "journal-entries"]
	},
	{
		name: "href",
		type: "text",
		admin: { condition: whenType("country") }
	},
	{
		name: "image",
		type: "upload",
		relationTo: "media",
		// ARCH: maps to ICardItem.imageUrl on the frontend
		admin: {
			condition: whenType(
				"country",
				"routeIdea",
				"experience",
				"journal",
				"servicesDirection"
			)
		}
	},
	{
		name: "badge",
		type: "text",
		localized: true,
		admin: {
			condition: whenType(
				"country",
				"routeIdea",
				"experience",
				"tripFormat",
				"servicesBusiness"
			)
		}
	},
	{
		name: "title",
		type: "text",
		localized: true
	},
	{
		name: "description",
		type: "richText",
		localized: true,
		admin: {
			condition: whenType(
				"country",
				"destinationInsight",
				"routeIdea",
				"experience",
				"tripFormat",
				"servicesBusiness",
				"servicesDirection",
				"servicesProcess"
			)
		}
	},
	{
		name: "meta",
		type: "text",
		localized: true,
		admin: { condition: whenType("routeIdea", "journal") }
	},
	{
		name: "value",
		type: "text",
		localized: true,
		admin: { condition: whenType("overviewStat") }
	},
	{
		name: "cities",
		type: "array",
		localized: true,
		fields: [
			{
				name: "name",
				type: "text",
				localized: true
			}
		],
		admin: { condition: whenType("country") }
	},
	{
		name: "featured",
		type: "checkbox",
		admin: { condition: whenType("country") }
	},
	{
		name: "ctaHref",
		type: "text",
		admin: { condition: whenType("routeIdea") }
	},
	{
		name: "ctaLabel",
		type: "text",
		localized: true,
		admin: { condition: whenType("routeIdea", "servicesDirection") }
	},
	{
		name: "stand",
		type: "text",
		localized: true,
		admin: { condition: whenType("tradeFair") }
	},
	{
		name: "country",
		type: "text",
		localized: true,
		admin: { condition: whenType("tradeFair") }
	},
	{
		name: "participants",
		type: "text",
		localized: true,
		admin: { condition: whenType("tradeFair") }
	},
	{
		name: "step",
		type: "text",
		localized: true,
		admin: { condition: whenType("servicesProcess") }
	},
	{
		name: "icon",
		type: "text",
		// ARCH: Lucide icon string key — getLucideIcon on the frontend
		admin: {
			condition: whenType(
				"destinationInsight",
				"overviewStat",
				"servicesBusiness",
				"tripFormat"
			)
		}
	},
	{
		name: "className",
		type: "text",
		admin: { condition: whenType("servicesBusiness") }
	}
];
