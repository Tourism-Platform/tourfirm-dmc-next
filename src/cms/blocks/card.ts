import type { Field } from "payload";

const cardTypeOptions = [
	{ label: "Country", value: "country" },
	{ label: "Destination Insight", value: "destinationInsight" },
	{ label: "Team Member", value: "teamMember" },
	{ label: "Route Idea", value: "routeIdea" },
	{ label: "Experience", value: "experience" },
	{ label: "Trade Fair", value: "tradeFair" },
	{ label: "Blog", value: "blog" },
	{ label: "News", value: "news" },
	{ label: "Journal (legacy)", value: "journal" },
	{ label: "Overview Stat", value: "overviewStat" },
	{ label: "Services Business", value: "servicesBusiness" },
	{ label: "Services Direction", value: "servicesDirection" },
	{ label: "Services Process", value: "servicesProcess" },
	{ label: "Trip Format", value: "tripFormat" },
	{ label: "Dash Title", value: "dashTitle" },
	{ label: "Quote", value: "quote" },
	{ label: "Alert", value: "alert" },
	{ label: "Mini Table", value: "miniTable" },
	{ label: "Portrait", value: "portrait" },
	{ label: "Catalog Feed", value: "catalogFeed" },
	{ label: "Tour Destination", value: "tourDestination" }
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
		relationTo: ["routes", "experiences", "trade-fairs", "blog", "news"]
	},
	{
		name: "href",
		type: "text",
		admin: {
			condition: whenType("country", "tourDestination", "teamMember")
		}
	},
	{
		name: "image",
		type: "upload",
		relationTo: "media",
		// ARCH: maps to ICardItem.imageUrl on the frontend
		admin: {
			condition: whenType(
				"country",
				"tourDestination",
				"routeIdea",
				"experience",
				"blog",
				"journal",
				"news",
				"catalogFeed",
				"servicesDirection",
				"portrait"
			)
		}
	},
	{
		name: "imageUrl",
		type: "text",
		admin: {
			description: "Static path fallback when Media upload is empty",
			condition: whenType(
				"country",
				"tourDestination",
				"routeIdea",
				"experience",
				"blog",
				"journal",
				"news",
				"catalogFeed",
				"servicesDirection",
				"portrait"
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
				"tourDestination",
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
				"tourDestination",
				"destinationInsight",
				"teamMember",
				"routeIdea",
				"experience",
				"tripFormat",
				"servicesBusiness",
				"servicesDirection",
				"servicesProcess",
				"dashTitle",
				"alert"
			)
		}
	},
	{
		name: "quote",
		type: "richText",
		localized: true,
		admin: { condition: whenType("quote") }
	},
	{
		name: "meta",
		type: "text",
		localized: true,
		admin: {
			condition: whenType(
				"routeIdea",
				"blog",
				"journal",
				"news",
				"catalogFeed"
			)
		}
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
		admin: { condition: whenType("country", "tourDestination") }
	},
	{
		name: "featured",
		type: "checkbox",
		admin: { condition: whenType("country", "tourDestination") }
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
		admin: {
			condition: whenType("routeIdea", "servicesDirection", "catalogFeed")
		}
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
				"teamMember",
				"overviewStat",
				"servicesBusiness",
				"tripFormat",
				"miniTable"
			)
		}
	},
	{
		name: "rows",
		type: "array",
		admin: { condition: whenType("miniTable") },
		fields: [
			{
				name: "icon",
				type: "text"
			},
			{
				name: "title",
				type: "text",
				required: true,
				localized: true
			},
			{
				name: "description",
				type: "text",
				localized: true
			}
		]
	},
	{
		name: "className",
		type: "text",
		admin: {
			condition: whenType("servicesBusiness", "catalogFeed", "country")
		}
	}
];
