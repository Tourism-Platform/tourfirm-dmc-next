import type { Block } from "payload";

import { routeMapAsideItemFields } from "./route-map-aside-item";

// Stop order = block.stops[] array position only. Do not add order/index/position fields.
export const RouteMap: Block = {
	slug: "routeMap",
	fields: [
		{
			name: "eyebrow",
			type: "text",
			localized: true
		},
		{
			name: "title",
			type: "text",
			localized: true
		},
		{
			name: "description",
			type: "richText",
			localized: true
		},
		{
			name: "aside",
			type: "group",
			admin: {
				description:
					"Optional left panel. When empty, the map panel spans the full width."
			},
			fields: [
				{
					name: "eyebrow",
					type: "text",
					localized: true
				},
				{
					name: "title",
					type: "text",
					localized: true
				},
				{
					name: "description",
					type: "richText",
					localized: true
				},
				{
					name: "items",
					type: "array",
					label: "Accordion items",
					fields: routeMapAsideItemFields
				}
			]
		},
		{
			name: "mapPanel",
			type: "group",
			admin: {
				description:
					"Header and optional link above the interactive map."
			},
			fields: [
				{
					name: "eyebrow",
					type: "text",
					localized: true
				},
				{
					name: "title",
					type: "text",
					localized: true
				},
				{
					name: "description",
					type: "richText",
					localized: true
				},
				{
					name: "linkLabel",
					type: "text",
					localized: true
				},
				{
					name: "linkHref",
					type: "text"
				}
			]
		},
		{
			name: "mapCenter",
			type: "group",
			fields: [
				{
					name: "latitude",
					type: "number"
				},
				{
					name: "longitude",
					type: "number"
				}
			]
		},
		{
			name: "zoom",
			type: "number"
		},
		{
			name: "stops",
			type: "array",
			label: "Route Stops",
			fields: [
				{
					name: "entityType",
					type: "select",
					options: ["country", "region", "city", "attraction"],
					required: true
				},
				{
					name: "relation",
					type: "relationship",
					relationTo: [
						"countries",
						"regions",
						"cities",
						"attractions"
					],
					required: true
				}
			]
		}
	]
};
