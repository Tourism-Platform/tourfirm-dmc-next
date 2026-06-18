import type { CollectionConfig } from "payload";

const mapPointTypeOptions = [
	{ label: "City", value: "CITY" },
	{ label: "Attraction", value: "ATTRACTION" },
	{ label: "Overnight", value: "OVERNIGHT" },
	{ label: "Border", value: "BORDER" },
	{ label: "Airport", value: "AIRPORT" },
	{ label: "Waypoint", value: "WAYPOINT" }
] as const;

export const MapPoints: CollectionConfig = {
	slug: "map-points",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["order", "type", "title"]
	},
	access: {
		read: () => true
	},
	fields: [
		{
			name: "route",
			type: "relationship",
			relationTo: "routes",
			required: true
		},
		{
			name: "order",
			type: "number",
			required: true
		},
		{
			name: "type",
			type: "select",
			required: true,
			options: [...mapPointTypeOptions]
		},
		{
			name: "city",
			type: "relationship",
			relationTo: "cities"
		},
		{
			name: "attraction",
			type: "relationship",
			relationTo: "attractions"
		},
		{
			name: "latitude",
			type: "number",
			required: true
		},
		{
			name: "longitude",
			type: "number",
			required: true
		},
		{
			name: "title",
			type: "text",
			localized: true
		}
	]
};
