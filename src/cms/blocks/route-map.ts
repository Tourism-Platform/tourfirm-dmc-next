import type { Block } from "payload";

// ARCH: schema pages.blocks lists contactInfo, not routeMap — slug follows frontend BlockType
// ARCH: tileUrl/tileAttribution/minZoom/maxZoom are frontend defaults, not stored in CMS
// Map stops are resolved on the frontend from the current document relationships
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
		}
	]
};
