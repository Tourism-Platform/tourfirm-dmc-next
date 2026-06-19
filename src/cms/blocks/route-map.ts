import type { Block } from "payload";

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
			type: "textarea",
			localized: true
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
